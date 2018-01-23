package wlcp.gameserver.modules;

import java.util.ArrayList;

import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.task.Task;

public class TaskManagerModule extends Module implements IModule {
	
	private ArrayList<Task> tasks = new ArrayList<Task>();
	private LoggerModule logger;
	
	public TaskManagerModule() {
		super(Modules.TASK_MANAGER);
	}
	
	public void addTask(Task task) {
		try {
			new Thread(task).start();
			release();
			tasks.add(task);
			release();
			logger.write("Task " + task.getTaskName() + " (" + task.getName() + ")" + " Added...");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void removeTask(Task task) {
		for(Task t : tasks) {
			if(t.equals(task)) {
				t.ShutDown();
				break;
			}
		}
		try {
			accquire();
			tasks.remove(task);
			release();
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.write("Task " + task.getTaskName() + " (" + task.getName() + ")" + " Removed...");
	}
	
	@Override
	public void Setup() {
		logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER);
		logger.write("Setting up Task Manager...");
	}
	
	public void Update() {

	}
	
	public void CleanUp() {
		for(Task t : tasks) {
			t.ShutDown();
		}
	}
	
	public ArrayList<Task> getTasks() {
		return this.tasks;
	}
}
