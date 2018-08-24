package wlcp.gameserver.api;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.util.LinkedList;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Semaphore;

import wlcp.gameserver.api.exception.CouldNotConnectToWLCPException;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GameLobbyInfo;

public class WLCPGameServer extends Thread implements IWLCPGameServer  {
	
	private String ipAddress;
	private int ipPort;
	private AsynchronousSocketChannel channel;
	private WLCPGameServerListener listener;
	private ConcurrentLinkedQueue<ByteBuffer> recievedPackets = new ConcurrentLinkedQueue<ByteBuffer>();
	private final Semaphore available = new Semaphore(1, true);
	private Server server;
	
	public WLCPGameServer(String ipAddress, int ipPort) {
		this.ipAddress = ipAddress;
		this.ipPort = ipPort;
	}
	
	public <A> void connect(CompletionHandler<Void, ? super A> completionHandler, A attachment) {
		
		//Open up an async socket channel
		try {
			channel = AsynchronousSocketChannel.open();
		} catch (IOException e) {
			completionHandler.failed(e, attachment);
			return;
		}
		
		//Connect
		channel.connect(new InetSocketAddress(ipAddress, ipPort), this, new CompletionHandler<Void, WLCPGameServer>() {
            @Override
            public void completed(Void result, WLCPGameServer wlcpGameServer ) {  
            	
            	//Start the processing thread
            	wlcpGameServer.start();
            	
    			//Create a new container for server information
    			server = new Server(wlcpGameServer.channel, wlcpGameServer);
    			
    			//Create a new handler to handle reads and writes
    			ReadWriteHandler readWriteHandler = new ReadWriteHandler();
    			
    			//Go into read mode
    			wlcpGameServer.channel.read(server.buffer, server, readWriteHandler);
    			
    			//Call the users completion handler
    			completionHandler.completed(result, attachment);
            }

            @Override
            public void failed(Throwable exc, WLCPGameServer channel) {
            	//Call the users completion handler
                completionHandler.failed(new CouldNotConnectToWLCPException("IOException. Could not connect to server. Verify ip and port are set correctly."), attachment);
            }});
		} 
	
	public <A> void disconnect(CompletionHandler<Void, ? super A> completionHandler, A attachment) {
		
		//Try to close the channel
		try {
			//Success
			channel.close();
			completionHandler.completed(null, attachment);
		} catch (IOException e) {
			//Failure
			completionHandler.failed(e, attachment);
		}
	}
	
	public void run() {
		while(true) {
			try {
				accquire();
				for(ByteBuffer byteBuffer : recievedPackets) {
					handlePacket(byteBuffer);
					recievedPackets.remove(byteBuffer);
				}
				release();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public <A> void SendPacket(IPacket packet, CompletionHandler<Void, ? super A> completionHandler, A attachment) {
		ByteBuffer byteBuffer = packet.assemblePacket();
		channel.write(packet.assemblePacket(), channel, new CompletionHandler<Integer, AsynchronousSocketChannel >() {
            @Override
            public void completed(Integer result, AsynchronousSocketChannel channel ) {
            	if(result != packet.getPacketSize()) {
            		//Keep writing
            		channel.write(byteBuffer, channel, this);
            	}
            	completionHandler.completed(null, attachment);
            }

            @Override
            public void failed(Throwable exc, AsynchronousSocketChannel channel) {
            	completionHandler.failed(exc, attachment);
            }
		});
	}
	
	public void registerEventListener(WLCPGameServerListener listener) {
		this.listener = listener;
	}
	
	private void handlePacket(ByteBuffer byteBuffer) {
		byteBuffer.flip();
		switch(PacketTypes.values()[byteBuffer.get(0)]) {
		case GAME_LOBBIES:
			GameLobbiesPacket packet = new GameLobbiesPacket();
			packet.populateData(byteBuffer);
			listener.GameLobbiesRecieved(packet);
			break;
		default:
			break;
		}
	}
	
	public void AddPacket(ByteBuffer byteBuffer) {
		try {
			accquire();
			recievedPackets.add(byteBuffer);
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private void accquire() throws InterruptedException {
		available.acquire();
	}
	
	private void release() {
		available.release();
	}

	@Override
	public void getGameLobbiesForUsername(String username) {
		GameLobbiesPacket packet = new GameLobbiesPacket(username);
		SendPacket(packet, new CompletionHandler<Void, Void>() {
			@Override
			public void completed(Void result, Void attachment) {
				// TODO Auto-generated method stub
				
			}
	
			@Override
			public void failed(Throwable exc, Void attachment) {
				// TODO Auto-generated method stub
				
			}	
		}, null);	
	}
}

class ReadWriteHandler implements CompletionHandler<Integer, Server> {

	public void completed(Integer result, Server server) {
		
	    //Flip the buffer
	    server.buffer.flip();
	  
	    //Add all of the new bytes to the linked list of bytes
	    for(int i = 0; i < result; i++) {
		    server.inputBytes.add(server.buffer.get());
	    }
	  
	    //Clear the buffer so more data can be put into it
	    server.buffer.clear();	
	    
		//We need to read until all bytes of the packet have been returned
		//If we do not do this, full packets wont be read and data will get corrupt
	    while(true) {
	    	
			//If we have atleast 5 bytes (type + size)
		    if(server.inputBytes.size() >= 5 && server.packetLength == 0) {
			    byte[] bytes = {server.inputBytes.get(1), server.inputBytes.get(2), server.inputBytes.get(3), server.inputBytes.get(4)};
			    server.packetLength = ByteBuffer.wrap(bytes).getInt();
		    }
		    
		    //If we have enough bytes to finish processing a packet
			if(server.inputBytes.size() >= server.packetLength && server.packetLength != 0) {
				ByteBuffer buffer = ByteBuffer.allocate(server.packetLength);
				for(int i = 0; i < server.packetLength; i++) {
					buffer.put(server.inputBytes.removeFirst());
				}
				server.wlcpGameServer.AddPacket(buffer);
				server.packetLength = 0;
				if(server.inputBytes.size() == 0) {
					server.serverSocket.read(server.buffer, server, this); 
					break; 
				} 
			} else {
				if(server.packetLength != 0 ) {server.packetLength -= result;}
				server.serverSocket.read(server.buffer, server, this);
				break;
			}
	    }
	}

	public void failed(Throwable exc, Server attachment) {
		// TODO Auto-generated method stub
		
	}
	
}

class Server {
	
	public AsynchronousSocketChannel serverSocket;
	public ByteBuffer buffer = ByteBuffer.allocate(65535);
	public WLCPGameServer wlcpGameServer;
	public LinkedList<Byte> inputBytes = new LinkedList<Byte>();
	public int packetLength = 0;

	public Server(AsynchronousSocketChannel serverSocket, WLCPGameServer wlcpGameServer) {
		this.serverSocket = serverSocket;
		this.wlcpGameServer = wlcpGameServer;
	}
}


