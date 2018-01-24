package wlcp.gameserver.tasks;

import java.util.concurrent.ConcurrentLinkedQueue;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.LoggerModule;
import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;
import wlcp.shared.packet.IPacket;

public class GameInstanceTask extends Task implements ITask {

	private int gameInstanceId;
	private String gameId;
	private int gameLobbyId;
	
	private LoggerModule logger;
	private ConcurrentLinkedQueue<IPacket> recievedPackets;
	private JPAEntityManager entityManager;
	
	public GameInstanceTask(String gameId, int gameLobbyId) {
		super("Game Instance");
		//super("Game Instance " + gameInstanceId);
		logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER);
		logger.write("Starting the game " + gameId + " instance id " + gameInstanceId);
		recievedPackets = new ConcurrentLinkedQueue<IPacket>();
	}
	
	public void DistributePacket(IPacket packet) {
		try {
			accquire();
			recievedPackets.add(packet);
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
	public void Update() {
		
	}
	
	@Override
	public void CleanUp() {
		
	}
	
	@Override 
	public void ShutDown() {
		
	}

	public int getGameInstanceId() {
		return gameInstanceId;
	}

	public String getGameId() {
		return gameId;
	}
	
}
