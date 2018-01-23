package wlcp.gameserver.module;

import java.util.concurrent.Semaphore;

/**
 * Abstract class that represents a Module.
 * This backend is modular meaning that its 
 * functions are split into different modules.
 * A module is added to a list which contains other modules.
 * These modules are all updated in order. Modules have a moduleID.
 * This is set via the ModuleManager.Modules enum in ModuleManager.Java.
 * @author Matthew Micciolo
 *
 */
public abstract class Module {
	
	protected Modules module;
	private final Semaphore available = new Semaphore(10, true);
	
	/**
	 * Default constructor
	 */
	public Module() {
		
	}
	
	/**
	 * Module ID from ModuleManager.Modules enum in ModuleManager.java
	 * @param moduleId moduleID from ModuleManager.Modules
	 */
	public Module(Modules module) {
		this.module = module;
		Setup();
	}
	
	/**
	 * Called before module starts running.
	 */
	protected void Setup() {
		
	}
	
	/**
	 * Called when the module is exiting such as being removed
	 * from the ModuleManager.
	 */
	public void CleanUp() {
		
	}
	
	/**
	 * Called in a loop while the module is running.
	 */
	public void Update() {
		
	}

	/**
	 * Gets the module enum
	 * @param module new module enum value
	 */
	public Modules getModule() {
		return module;
	}

	/**
	 * Sets the module enum
	 * @param module new module enum value
	 */
	public void setModule(Modules module) {
		this.module = module;
	}
	
	/**
	 * Called when there is an event waiting
	 * @param e event
	 */
//	public void eventHandler(IEvent e) {
//		
//	}
	
	
	/**
	 * Called to accquire a resource
	 * @throws InterruptedException 
	 */
	protected void accquire() throws InterruptedException {
		available.acquire();
	}
	
	/** 
	 * Called to release a resource
	 */
	protected void release() {
		available.release();
	}
}