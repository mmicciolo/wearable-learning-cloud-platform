package wlcp.gameserver.server;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.persistence.jpa.JpaEntityManager;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.ConfigurationModule;
import wlcp.gameserver.modules.LoggerModule;
import wlcp.gameserver.modules.TaskManagerModule;
import wlcp.gameserver.tasks.PacketDistributorTask;
import wlcp.gameserver.tasks.ServerPacketHandlerTask;
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
		
		Runtime.getRuntime().addShutdownHook(new Thread() {
			public void run() {
				System.out.println("Shutdown");
			}
		});
		
		Setup();
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
		modules.add(new TaskManagerModule());
		
		//Setup the modules
		for(IModule module : modules) {
			module.Setup();
			ModuleManager.getInstance().addModule((Module)module);
		}
		
		((TaskManagerModule)ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).addTask(new PacketDistributorTask());
		((TaskManagerModule)ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).addTask(new ServerPacketHandlerTask());
	}
	
	private static void Setup() {
		JPAEntityManager entityManager = new JPAEntityManager();
		entityManager.getEntityManager().getTransaction().begin();
		entityManager.getEntityManager().createQuery("DELETE FROM GameInstance").executeUpdate();
		entityManager.getEntityManager().getTransaction().commit();
		entityManager.CleanUp();
	}
}
