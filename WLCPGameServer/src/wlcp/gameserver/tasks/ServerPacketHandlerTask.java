package wlcp.gameserver.tasks;

import java.util.concurrent.ConcurrentLinkedQueue;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.TaskManagerModule;
import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packets.StartGameInstancePacket;

public class ServerPacketHandlerTask extends Task implements ITask {
	
	private ConcurrentLinkedQueue<IPacket> recievedPackets;
	private JPAEntityManager entityManager;

	public ServerPacketHandlerTask() {
		super("Server Packet Handler");
		recievedPackets = new ConcurrentLinkedQueue<IPacket>();
		entityManager = new JPAEntityManager();
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
		try {
			accquire();
			for(IPacket packet : recievedPackets) {
				HandlePacket(packet);
				recievedPackets.remove(packet);
			}
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
	public void CleanUp() {
		entityManager.CleanUp();
	}
	
	private void HandlePacket(IPacket packet) {
		switch(packet.getType()) {
		case START_GAME_INSTANCE:
			StartGameInstance((StartGameInstancePacket) packet);
			break;
		default:
			break;
		}
	}
	
	private void StartGameInstance(StartGameInstancePacket packet) {
		
		//1. Make sure the game exists
		//2. Make sure the game lobby exists
		//3. Make sure a game instance of the lobby has not already been started
		//4. Create the instance
		
		//Get the task manager
		TaskManagerModule taskManager = (TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER);
		
		//Create the game instance
		GameInstanceTask newGameInstance = new GameInstanceTask(packet.getGameId(), packet.getGameLobbyId());
		
		//Add the game instance
		taskManager.addTask(newGameInstance);
	}

}
