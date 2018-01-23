package wlcp.gameserver.modules;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.channels.AsynchronousServerSocketChannel;

import wlcp.gameserver.config.Configurations;
import wlcp.gameserver.config.ServerConfiguration;
import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;

public class GameServerModule extends Module implements IModule {

	private LoggerModule logger;
	private AsynchronousServerSocketChannel serverSocket;
	
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
		//ClientData clientData = new ClientData(serverSocket, null, this);
		
		try {
			
			//Begin accepting connections
			//serverSocket.accept(clientData, new ServerConnectionHandler());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void Update() {
		
	}
	
	@Override 
	public void CleanUp() {
		
	}
}
