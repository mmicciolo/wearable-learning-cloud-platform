package wlcp.gameserver.server;

import java.util.ArrayList;
import java.util.List;

import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.ConfigurationModule;
import wlcp.gameserver.modules.LoggerModule;
import wlcp.gameserver.modules.GameServerModule;

/**
 * Wearable Learning Cloud Platform Game Server
 * This server is used to server game instances
 * of wearable learning games to wearable learning
 * watch or phone devices.
 * 
 * @author Matthew Micciolo
 * Worcester Polytechnic Institute
 * IMGD Master's Thesis
 * Designing a Visual Programming Language for creation
 * of Multiplayer Embodied Games
 *
 */
public class WLCPGameServer {
	
	private static List<IModule> modules = new ArrayList<IModule>();
	private static boolean running = true;
	
	public static void main(String[] args) {
		
		SetupModuleManager();
		
		while(running) {
			ModuleManager.getInstance().Update();
			try {
				Thread.sleep(17);
			} catch (InterruptedException e) {

			}
		}
		
		ModuleManager.getInstance().CleanUp();
	}

	private static void SetupModuleManager() {
		
		//Create an instance of the Module Manager
		ModuleManager.getInstance();
		
		//Add the modules we want to use to a list
		modules.add(new LoggerModule());
		modules.add(new ConfigurationModule());
		modules.add(new GameServerModule());
	}

}
