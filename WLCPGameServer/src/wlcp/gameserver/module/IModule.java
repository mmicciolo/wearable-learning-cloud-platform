package wlcp.gameserver.module;

/**
 * Interface for Modules.
 * All modules must define these methods.
 * @author Matthew Micciolo
 *
 */
public interface IModule {

	/**
	 * Called before module starts running.
	 */
	void Setup();
	
	/**
	 * Called when the module is exiting such as being removed
	 * from the ModuleManager.
	 */
	void CleanUp();
	
	/**
	 * Called in a loop while the module is running.
	 */
	void Update();
	
	/**
	 * Called to take control of a data item in a running task.
	 * This is used when two threads try accessing data at the same time.
	 */
	//void accquire() throws InterruptedException;
	
	/**
	 * Called to release control of a data item in a running task.
	 */
	//void release();
}