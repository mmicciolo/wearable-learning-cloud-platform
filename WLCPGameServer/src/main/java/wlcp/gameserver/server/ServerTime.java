package wlcp.gameserver.server;

/**
 * Keeps track of time since the server started in milliseconds
 * @author Matthew Micciolo
 *
 */
public class ServerTime {
	
	private final long startTime;
	
	/**
	 * Default constructor.
	 * Initialize start time to the current time.
	 */
	public ServerTime() {
		startTime = System.currentTimeMillis();
	}
	
	/**
	 * Return elapsed time by subtracting startTime from the
	 * current time.
	 * @return elapsedTime since start
	 */
	public double getElapsedTime() {
		return System.currentTimeMillis() - startTime;
	}
	
	/**
	 * Returns the start time in milliseconds.
	 * @return start time in milliseconds
	 */
	public long getStartTime() {
		return this.startTime;
	}
}
