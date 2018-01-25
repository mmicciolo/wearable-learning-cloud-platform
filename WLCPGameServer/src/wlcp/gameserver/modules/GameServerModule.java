package wlcp.gameserver.modules;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

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

		@Override
		public void completed(Integer result, ClientData clientData) {
			if(result > 0) {
				PacketDistributorTask packetDistributor = (PacketDistributorTask) ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasks().get(0);
				packetDistributor.DataRecieved(clientData);
				clientData.setBuffer(ByteBuffer.allocate(65535));
				clientData.getClientSocket().read(clientData.getBuffer(), clientData, this);
//				clientData.getBuffer().flip();
//				System.out.println("Packet Here!");
//				for(int i = 0; i < result; i++) {
//					System.out.print(clientData.getBuffer().array()[i]);
//				}
//				//logger.write("Data Recieved " + StandardCharsets.UTF_8.decode(clientData.getBuffer()).toString());
//				clientData.getBuffer().clear();
//				clientData.getClientSocket().read(clientData.getBuffer(), clientData, this);
//				clientData.getClientSocket().write(ByteBuffer.allocate(1));
			} else if(result == -1) {
				
				logger.write("Client Disconnected...");
				
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
			
			//Some sort of reading error occured
			logger.write("Reading error occured...");
			logger.write(exc.getMessage());
//			//If we get here, either the client disconnected or the client lost connection
//			//Lets handle both situations the same way by removing them
//			logger.write("Client Disconnected...");
//			
//			//Remove from the client list
//			clientData.getServer().getClients().remove(clientData);
//			
//			//Close the connection
//			try {
//				clientData.getClientSocket().close();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
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
