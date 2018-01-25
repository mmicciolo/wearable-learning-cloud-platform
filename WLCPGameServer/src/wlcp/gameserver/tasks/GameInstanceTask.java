package wlcp.gameserver.tasks;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.gameserver.model.ClientData;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.LoggerModule;
import wlcp.gameserver.modules.TaskManagerModule;
import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;
import wlcp.model.master.Game;
import wlcp.model.master.GameInstance;
import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;
import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectPacket;

class UsernameClientData {
	public UsernameClientData(Username username, ClientData clientData) {
		this.username = username;
		this.clientData = clientData;
	}
	public Username username;
	public ClientData clientData;
}

public class GameInstanceTask extends Task implements ITask {

	private GameInstance gameInstance;
	private Game game;
	private GameLobby gameLobby;
	private Map<UsernameClientData, Byte> usernameTeams;
	
	private LoggerModule logger;
	private PacketDistributorTask packetDistributor;
	private ConcurrentLinkedQueue<PacketClientData> recievedPackets;
	private JPAEntityManager entityManager;
	
	public GameInstanceTask(GameInstance gameInstance, Game game, GameLobby gameLobby) {
		super("Game Instance " + gameInstance.getGameInstanceId());
		this.gameInstance = gameInstance;
		this.game = game;
		this.gameLobby = gameLobby;
		logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER);
		logger.write("Starting the game " + game.getGameId() + " instance id " + gameInstance.getGameInstanceId());
		packetDistributor = (PacketDistributorTask) ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasks().get(0);
		recievedPackets = new ConcurrentLinkedQueue<PacketClientData>();
		usernameTeams = new HashMap<UsernameClientData, Byte>();
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
	
	private void HandlePacket(PacketClientData packetClientData) {
		switch(packetClientData.packet.getType()) {
		case CONNECT:
			UserConnect(packetClientData);
			break;
		default:
			break;
		}
	}
	
	private void UserConnect(PacketClientData packetClientData) {
		
		//Get the connect packet
		ConnectPacket connectPacket = (ConnectPacket) packetClientData.packet;
		
		//Get the user from the db
		Username username = entityManager.getEntityManager().find(Username.class, connectPacket.getUsername());
		
		//Check to make sure the player doesnt already exist in the game
		if(usernameTeams.containsKey(username)) {
			//User already exists in the game, maybe they are trying to reconnect?
		}
		
		//See if the team they are trying to join is full
		int count = 0;
		for(Byte team : usernameTeams.values()) {
			if(team == connectPacket.getTeamNumber()) { count++; }
		}
		if(count >= game.getTeamCount()) {
			//Team is full, handle
		}
		
		//They passed our tests, they can join
		usernameTeams.put(new UsernameClientData(username, packetClientData.clientData), connectPacket.getTeamNumber());
		
		//Send them a connection success
		ConnectAcceptedPacket connectAccepted = new ConnectAcceptedPacket();
		
		//Send the packet
		packetDistributor.AddPacketToSend(connectAccepted, packetClientData.clientData);
		
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
		
	}
	
	@Override 
	public void ShutDown() {
		
	}

	public int getGameInstanceId() {
		return gameInstance.getGameInstanceId();
	}

	public String getGameId() {
		return game.getGameId();
	}
	
}
