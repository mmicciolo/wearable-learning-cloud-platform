package wlcp.gameserver.tasks;

import java.util.concurrent.ConcurrentLinkedQueue;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.TaskManagerModule;
import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;
import wlcp.model.master.Game;
import wlcp.model.master.GameInstance;
import wlcp.model.master.GameLobby;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packets.StartGameInstancePacket;

public class ServerPacketHandlerTask extends Task implements ITask {
	
	private ConcurrentLinkedQueue<PacketClientData> recievedPackets;
	private JPAEntityManager entityManager;

	public ServerPacketHandlerTask() {
		super("Server Packet Handler");
		recievedPackets = new ConcurrentLinkedQueue<PacketClientData>();
		entityManager = new JPAEntityManager();
	}
	
	public void DistributePacket(PacketClientData packetClientData) {
		try {
			accquire();
			recievedPackets.add(packetClientData);
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
			for(PacketClientData packet : recievedPackets) {
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
	
	private void HandlePacket(PacketClientData packetClientData) {
		switch(packetClientData.packet.getType()) {
		case START_GAME_INSTANCE:
			StartGameInstance(packetClientData);
			break;
		default:
			break;
		}
	}
	
	private void StartGameInstance(PacketClientData packetClientData) {
		
		//Get the start game packet
		StartGameInstancePacket startGameInstancePacket = (StartGameInstancePacket) packetClientData.packet;
		
		//1. Make sure the game exists
		Game game = entityManager.getEntityManager().find(Game.class, startGameInstancePacket.getGameId());
		
		//2. Make sure the game lobby exists
		//3. Make sure a game instance of the lobby has not already been started
		//4. Create the instance
		
		//Add it to the database
		entityManager.getEntityManager().getTransaction().begin();
		GameLobby gameLobby = entityManager.getEntityManager().find(GameLobby.class, startGameInstancePacket.getGameLobbyId());
		GameInstance gameInstance = new GameInstance(gameLobby, game);
		entityManager.getEntityManager().persist(gameInstance);
		entityManager.getEntityManager().getTransaction().commit();
		
		//Get the task manager
		TaskManagerModule taskManager = (TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER);
		
		//Create the game instance
		GameInstanceTask newGameInstance = new GameInstanceTask(gameInstance, game, gameLobby);
		
		//Add the game instance
		taskManager.addTask(newGameInstance);
		
		//5. Send back success
	}

}
