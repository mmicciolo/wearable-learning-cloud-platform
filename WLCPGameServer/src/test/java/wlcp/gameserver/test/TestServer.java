package wlcp.gameserver.test;

import java.util.ArrayList;
import java.util.List;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.ConfigurationModule;
import wlcp.gameserver.modules.GameServerModule;
import wlcp.gameserver.modules.LoggerModule;
import wlcp.gameserver.modules.TaskManagerModule;
import wlcp.gameserver.tasks.PacketDistributorTask;
import wlcp.gameserver.tasks.ServerPacketHandlerTask;

public class TestServer extends Thread {
	
	private static List<IModule> modules = new ArrayList<IModule>();
	private static boolean running = true;
	
	public void run() {
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
	
	public void shutdown() {
		running = false;
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
		((TaskManagerModule)ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).addTask(new ServerPacketHandlerTask(new JPAEntityManager(), (PacketDistributorTask) ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasksByType(PacketDistributorTask.class).get(0), (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER)));
	}
	
	private static void Setup() {
		JPAEntityManager entityManager = new JPAEntityManager();
		entityManager.getEntityManager().getTransaction().begin();
		entityManager.getEntityManager().createQuery("DELETE FROM GameInstance").executeUpdate();
		entityManager.getEntityManager().getTransaction().commit();
		entityManager.CleanUp();
	}
}
