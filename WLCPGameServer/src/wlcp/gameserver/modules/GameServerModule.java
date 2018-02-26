package wlcp.gameserver.modules;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousCloseException;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.bind.DatatypeConverter;

import wlcp.gameserver.config.Configurations;
import wlcp.gameserver.config.ServerConfiguration;
import wlcp.gameserver.model.ClientData;
import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.tasks.PacketDistributorTask;

public class GameServerModule extends Module implements IModule {

	private LoggerModule logger;
	private AsynchronousServerSocketChannel serverSocket;
	private List<ClientData> clients = new ArrayList<ClientData>();
	
	public GameServerModule() {
		super(Modules.SERVER);
	}
	
	@Override
	public void Setup() {
		logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER);
		logger.write("Starting WLCP Game Server...");
		InitServer();
	}
	
	private void InitServer() {
		
		//Get the server configuration
		ServerConfiguration serverConfiguration = (ServerConfiguration)((ConfigurationModule) ModuleManager.getInstance().getModule(Modules.CONFIGURATION)).getConfiguration(Configurations.SERVER);
		
		try {
			
			//Open up an async server socket channel
			serverSocket = AsynchronousServerSocketChannel.open();
			
			//Setup the address
			InetSocketAddress sAddr = new InetSocketAddress(InetAddress.getByName(serverConfiguration.getGameServerHostName()).getHostAddress(), serverConfiguration.getGameServerPortNumber());
			
			//Bind to the address and port
			serverSocket.bind(sAddr);
			
			logger.write("Server Binded To " + serverConfiguration.getGameServerHostName() + ":" + serverConfiguration.getGameServerPortNumber());
			
			//Accept connections
			AcceptIncomingConnections();
			
		} catch (IOException e) {
			logger.write("Game Server Could Not Bind To " + serverConfiguration.getGameServerHostName() + ":" + serverConfiguration.getGameServerPortNumber() + " " + e.getMessage());
			ModuleManager.getInstance().FatallyTerminateServer();
		}
	}
	
	private void AcceptIncomingConnections() {
		
		logger.write("Listening for connections...");
		
		//Create a new client data that will handle connection information
		ClientData clientData = new ClientData(serverSocket, this);
		
		try {
			
			//Begin accepting connections
			serverSocket.accept(clientData, new ServerConnectionHandler());
			
		} catch (Exception e) {
			logger.write("Failed to Accept Connection..." );
			logger.write(e.getMessage());
		}
	}
	
	class ServerConnectionHandler implements CompletionHandler<AsynchronousSocketChannel, ClientData> {
		
		@Override
		public void completed(AsynchronousSocketChannel client, ClientData clientData) {
			
			//A client connected
			logger.write("Connection Accepted...");
			
			//Accept them
			clientData.getServerSocket().accept(clientData, new ServerConnectionHandler());
			
			//Create a new read handler
			ServerReadHandler readHandler = new ServerReadHandler();
			
			//Create a new client data class to hold their data
			ClientData cd = new ClientData(clientData.getServerSocket(), client, clientData.getServer());
			
			//Begin reading data
			client.read(cd.getBuffer(), cd, readHandler);
			
			//Add the client
			clientData.getServer().getClients().add(cd);
		}

		@Override
		public void failed(Throwable arg0, ClientData arg1) {
			logger.write("Client Failed To Connect..." );
			logger.write(arg0.getMessage());
		}
	}
	
	class ServerReadHandler implements CompletionHandler<Integer, ClientData> {
		
		private boolean CheckForWebSocketHandshake(ClientData clientData) {
	    	//Check if the first 3 bytes are GET
			if(clientData.inputBytes.get(0) == 'G' && clientData.inputBytes.get(1) == 'E' && clientData.inputBytes.get(2) == 'T' && !clientData.webSocketHandshakeComplete) {
				clientData.setWebSocket(true);
			} else if(!clientData.isWebSocket()) {
				return true;
			}
			
			//If so its a connect request
			ByteBuffer byteBuffer = ByteBuffer.allocate(clientData.inputBytes.size());
			int size = clientData.inputBytes.size();
			for(int i = 0; i < size; i++) {
				byteBuffer.put(clientData.inputBytes.removeFirst());
			}
			byteBuffer.flip();
			clientData.webSocketHandshake = clientData.webSocketHandshake.concat(StandardCharsets.UTF_8.decode(byteBuffer).toString());
			if(clientData.webSocketHandshake.contains("\r\n\r\n")) {
				clientData.webSocketHandshakeComplete = true;
			}
			
			if(clientData.webSocketHandshakeComplete) {
			
				Matcher get = Pattern.compile("^GET").matcher(clientData.webSocketHandshake);
				if (get.find()) {
				    Matcher match = Pattern.compile("Sec-WebSocket-Key: (.*)").matcher(clientData.webSocketHandshake);
				    match.find();
				    byte[] response;
					try {
						response = ("HTTP/1.1 101 Switching Protocols\r\n"
						        + "Connection: Upgrade\r\n"
						        + "Upgrade: websocket\r\n"
						        + "Sec-WebSocket-Accept: "
						        + DatatypeConverter
						        .printBase64Binary(
						                MessageDigest
						                .getInstance("SHA-1")
						                .digest((match.group(1) + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
						                        .getBytes("UTF-8")))
						        + "\r\n\r\n")
						        .getBytes("UTF-8");

					    clientData.getClientSocket().write(ByteBuffer.wrap(response));
					    clientData.getClientSocket().read(clientData.getBuffer(), clientData, this); 
					    return true;
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (NoSuchAlgorithmException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}

			clientData.getClientSocket().read(clientData.getBuffer(), clientData, this); 
			return false;
		}
		
		private boolean CheckForWebSocketPacket(Integer result, ClientData clientData) {
			
			int bytesRead = 0;
			if(clientData.inputBytes.peekFirst() == -126 && clientData.packetLength == 0) {
				clientData.inputBytes.removeFirst();
				byte lengthByte = (byte) (clientData.inputBytes.removeFirst() & 127);
				ByteBuffer byteBuffer = ByteBuffer.allocate((int)lengthByte);
				for(int i = 0; i < 4; i++) {
					clientData.masks[i] = clientData.inputBytes.removeFirst();
				}
				clientData.packetLength = lengthByte;
			    clientData.recievedPacketAmount = clientData.packetLength;
			    bytesRead = clientData.inputBytes.size();
			} else {
				bytesRead = result;
			}
			
			//If we have enough bytes to finish processing a packet
			if(clientData.inputBytes.size() >= clientData.recievedPacketAmount && clientData.recievedPacketAmount != 0) {
				clientData.byteBuffer = ByteBuffer.allocate(clientData.packetLength);
				for(int i = 0; i < clientData.packetLength; i++) {
					byte data = (byte) (clientData.inputBytes.removeFirst() ^ clientData.masks[i % 4]);
					clientData.byteBuffer.put(data);
				}
				PacketDistributorTask packetDistributor = (PacketDistributorTask) ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasksByType(PacketDistributorTask.class).get(0);
				packetDistributor.DataRecieved(clientData);
				clientData.recievedPacketAmount = 0;
				clientData.packetLength = 0;
				if(clientData.recievedPacketAmount == clientData.inputBytes.size()) {
					clientData.getClientSocket().read(clientData.getBuffer(), clientData, this); 
				} 
			} else {
				
				//If we get here we havent recieved enough data, keep reading
				if(clientData.recievedPacketAmount != 0 ) {clientData.recievedPacketAmount -= bytesRead;}
				clientData.getClientSocket().read(clientData.getBuffer(), clientData, this);
			}
			
			return false;
		}
		
		private boolean CheckForWebSocketDisconnect(ClientData clientData) {
			if(clientData.inputBytes.peekFirst() == -120) {
				clientData.inputBytes.removeFirst();
				if(clientData.inputBytes.peekFirst() == -128) {
					clientData.getBuffer().clear();
					clientData.getClientSocket().write(clientData.getBuffer(), clientData, new ServerWriteHandler());
					return true;
				}
			}
			return false;
		}

		@Override
		public void completed(Integer result, ClientData clientData) {
			
			//Check if we recieved more than 0 bytes
			if(result > 0) {
				//Flip the buffer
			    clientData.getBuffer().flip();
			  
				//Add all of the new bytes to the linked list of bytes
				for(int i = 0; i < result; i++) {
					clientData.inputBytes.add(clientData.getBuffer().get());
				}
			  
				//Clear the buffer so more data can be put into it
				clientData.getBuffer().clear();
				
				//Check for web socket handshake
				if(!clientData.webSocketHandshakeComplete && clientData.inputBytes.size() >= 3) {
					CheckForWebSocketHandshake(clientData);
				}
				  
				//We need to read until all bytes of the packet have been returned
				//If we do not do this, full packets wont be read and data will get corrupt
				while(true) {
					
					if(!clientData.isWebSocket()) {
						//If we have atleast 5 bytes and already havent started reading another
					    //packet with data we recieved from an earlier read.
					    if(clientData.inputBytes.size() >= 5 && clientData.recievedPacketAmount == 0) {
					    	byte[] bytes = {clientData.inputBytes.get(1), clientData.inputBytes.get(2), clientData.inputBytes.get(3), clientData.inputBytes.get(4)};
						    clientData.packetLength = ByteBuffer.wrap(bytes).getInt();
						    clientData.recievedPacketAmount = clientData.packetLength;
					    }
					    
						//If we have enough bytes to finish processing a packet
						if(clientData.inputBytes.size() >= clientData.recievedPacketAmount && clientData.recievedPacketAmount != 0) {
							clientData.byteBuffer = ByteBuffer.allocate(clientData.packetLength);
							for(int i = 0; i < clientData.packetLength; i++) {
								clientData.byteBuffer.put(clientData.inputBytes.removeFirst());
							}
							PacketDistributorTask packetDistributor = (PacketDistributorTask) ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasksByType(PacketDistributorTask.class).get(0);
							packetDistributor.DataRecieved(clientData);
							clientData.recievedPacketAmount = 0;
							if(clientData.recievedPacketAmount == clientData.inputBytes.size()) {
								clientData.getClientSocket().read(clientData.getBuffer(), clientData, this); 
								break; 
							} 
						} else {
							
							//If we get here we havent recieved enough data, keep reading
							if(clientData.recievedPacketAmount != 0 ) {clientData.recievedPacketAmount -= result;}
							clientData.getClientSocket().read(clientData.getBuffer(), clientData, this);
							break;
						}
					} else if(clientData.webSocketHandshakeComplete) {
						if(clientData.inputBytes.size() >= 6) {
							CheckForWebSocketPacket(result, clientData);
							break;
					    } else {
					    	break;
					    }
					} else {
						break;
					}
				}
			} else if(result == -1) {
				//This happens when the client shut downs without calling close
				logger.write("Client Disconnected... (no close)");
				
				//Remove from the client list
				clientData.getServer().getClients().remove(clientData);
				
				//Close the connection
				try {
					clientData.getClientSocket().close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}

		@Override
		public void failed(Throwable exc, ClientData clientData) {
			
			if(exc instanceof AsynchronousCloseException) { 
				//This happens when we call close on a client socket
				logger.write("Client Disconnected... (async close)");
				return;
			} else if(exc instanceof IOException) {
				//If we get this, the client terminated or called close
				if(exc.getMessage() != null) {
					if(exc.getMessage().equals("The specified network name is no longer available.\r\n")) {
						logger.write("Client Disconnected... (terminated or closed)");
						return;
					}
				}
			} else {
				//Some sort of reading error occured
				logger.write("Reading error occured...");
				logger.write(exc.getMessage());
				return;
			}
		}
	}
	
	class ServerWriteHandler implements CompletionHandler<Integer, ClientData> {

		@Override
		public void completed(Integer result, ClientData clientData) {
			try {
				clientData.getClientSocket().close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		@Override
		public void failed(Throwable exc, ClientData clientData) {
			
		}
	}
	
	@Override
	public void Update() {
		
	}
	
	@Override 
	public void CleanUp() {
		
	}

	public List<ClientData> getClients() {
		return clients;
	}

	public void setClients(List<ClientData> clients) {
		this.clients = clients;
	}
	
}
