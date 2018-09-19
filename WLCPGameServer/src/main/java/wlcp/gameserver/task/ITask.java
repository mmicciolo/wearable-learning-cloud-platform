package wlcp.gameserver.task;

/**
 * Interface for task. All methods defined here
 * must be implemented in anything that interfaces with this.
 * @author Matthew Micciolo
 *
 */
public interface ITask {
	
	/**
	 * Called in a loop while the thread is
	 * still running.
	 */
	void Update();
	
	/**
	 * Called before exiting
	 */
	void CleanUp();
	
	/**
	 * Called to shutdown the thread
	 */
	void ShutDown();
	
	/**
	 * Called to take control of a data item in a running task.
	 * This is used when two threads try accessing data at the same time.
	 */
	void accquire() throws InterruptedException;
	
	/**
	 * Called to release control of a data item in a running task.
	 */
	void release();
}
