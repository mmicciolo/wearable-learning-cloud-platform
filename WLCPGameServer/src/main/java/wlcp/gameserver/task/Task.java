package wlcp.gameserver.task;

import java.util.Date;
import java.util.concurrent.Semaphore;

/**
 * Abstract class for Task. A task is a separate program that the server
 * can spawn onto a different thread. It can execute independently of the server
 * and perform a task of its own. For example, a task could be a game instance
 * or game engine that runs in a separate thread. It however can still receive server
 * data via events. This class extends Thread so can be started as a thread.
 * @author Matthew Micciolo
 *
 */
public abstract class Task extends Thread implements ITask {
	
	private boolean running = true;
	private String taskName;
	private final Semaphore available = new Semaphore(1, true);
	
	public Task(String taskName) {
		this.taskName = taskName;
	}
	
	/**
	 * This is where the thread first enters when it is first
	 * created.
	 */
	public void run() {
		while(running) {
			long start = new Date().getTime();
			Update();
			long end = new Date().getTime() - start;
			if(end < 17) {
				try {
					//Thread.sleep(17);
					Thread.sleep(17 - end);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
		CleanUp();
	}
	
	/**
	 * Called to shutdown thread (quit).
	 */
	public void ShutDown() {
		running = false;
	}
	
	/**
	 * Called in a loop while the thread is
	 * still running.
	 */
	public void Update() {
		
	}
	
	/**
	 * Called before exiting
	 */
	public void CleanUp() {
		
	}
	
	/**
	 * Called when an event has arrived
	 * @param e event
	 */
//	public void eventHandler(IEvent e) {
//		
//	}
	
	/**
	 * Called to accquire a resource
	 * @throws InterruptedException 
	 */
	public void accquire() throws InterruptedException {
		available.acquire();
	}
	
	/** 
	 * Called to release a resource
	 */
	public void release() {
		available.release();
	}

	public String getTaskName() {
		return taskName;
	}
	
}

