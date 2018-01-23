package wlcp.gameserver.module;

import java.util.ArrayList;
import java.util.List;

import wlcp.gameserver.modules.LoggerModule;

/**
 * This class takes care of managing all of the modules added to it.
 * This class is a singleton so it can be accessed anywhere meaning that
 * you can add modules any where and any time you want without needing to have a 
 * reference passed in from somewhere else.
 * @author Matt
 *
 */
public class ModuleManager {
	
	private static ModuleManager instance = null;
	private static List<Module> modules = new ArrayList<Module>();

	/**
	 * Constructor. Set the shutdownhook, i.e call clean
	 * on thread shutdown.
	 */
	protected ModuleManager() {
		setShutdownHook();
	}
	
	/**
	 * Get the module manager singleton instance
	 * @return ModuleManager singleton instance
	 */
	public static ModuleManager getInstance() {
		if(instance == null) {
			instance = new ModuleManager();
		}
		return instance;
	}
	
	/**
	 * Update all of modules in the list by calling
	 * all of their updates in a for loop.
	 */
	public void Update() {
		for(Module m : modules) {
			m.Update();
		}
	}
	
	/**
	 * Set the shutdownhook, i.e call clean on thread shutdown.
	 */
	private void setShutdownHook() {
		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			public void run() {
				CleanUp();
			}
		}));
	}
	
	/**
	 * Add a module to the module manager list
	 * @param m module to add
	 */
	public void addModule(Module m) {
		modules.add(m);
		LoggerModule logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER);
		logger.write("Module " + Modules.values()[m.getModule().ordinal()] + " Added...");
	}
	
	/**
	 * Remove a module from the module manager list
	 * @param m module to remove
	 */
	public void removeModule(Module m) {
		modules.remove(m);
	}
	
	/**
	 * Call all module cleanups in a for loop
	 */
	public void CleanUp() {
		for(Module m : modules) {
			m.CleanUp();
		}
	}
	
	/**
	 * Gets a module from the list specified by the Modules
	 * enumeration.
	 * @param module modules enumeration
	 * @return Module
	 */
	public Module getModule(Modules module) {
		for(Module m : modules) {
			if(m.getModule().equals(module)) {
				return m;
			}
		}
		return null;
	}
	
	/**
	 * Get a list of all of the modules
	 * @return Arraylist of all of the modules
	 */
	public List<Module> getModules() {
		return this.modules;
	}
}
