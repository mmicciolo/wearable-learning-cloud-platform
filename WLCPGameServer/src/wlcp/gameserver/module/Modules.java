package wlcp.gameserver.module;

/**
 * Enumertion of the different module types that the 
 * server will be composed of.
 * 
 * @author Matthew Micciolo
 * Worcester Polytechnic Institute
 * IMGD Master's Thesis
 * Designing a Visual Programming Language for creation
 * of Multiplayer Embodied Games
 *
 */
public enum Modules {
	
	/**
	 * Manages the entire program because this server is broken
	 * up into different module types. Task, Logger, Server, etc.
	 */
	MODULE_MANAGER,
	
	/**
	 * Debug Data Logger
	 */
	LOGGER,
	
	/**
	 * Reads configuration data.
	 */
	CONFIGURATION,
	
	/**
	 * Async socket server
	 */
	SERVER,
	
	/**
	 * Handles multithreading
	 */
	TASK_MANAGER
}
