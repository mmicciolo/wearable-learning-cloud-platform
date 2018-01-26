package wlcp.gameserver.tasks;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.gameserver.common.PlayerVM;
import wlcp.gameserver.common.UsernameClientData;
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
import wlcp.shared.packets.SingleButtonPressPacket;


class TeamPlayer {
	int team;
	int player;
	
	public TeamPlayer(int team, int player) {
		this.team = team;
		this.player = player;
	}
}

class Player {
	UsernameClientData usernameClientData;
	TeamPlayer teamPlayer;
	PlayerVM playerVM;
	
	public Player(UsernameClientData usernameClientData, TeamPlayer teamPlayer, PlayerVM playerVM) {
		this.usernameClientData = usernameClientData;
		this.teamPlayer = teamPlayer;
		this.playerVM = playerVM;
	}
}

public class GameInstanceTask extends Task implements ITask {

	private GameInstance gameInstance;
	private Game game;
	private GameLobby gameLobby;
	private List<Player> players;
	
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
		players = new ArrayList<Player>();
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
		case SINGLE_BUTTON_PRESS:
			System.out.println("Button");
			SingleButtonPress(packetClientData);
			break;
		default:
			break;
		}
	}
	
	private void SingleButtonPress(PacketClientData packetClientData) {
		
		//Get the single button press packet
		SingleButtonPressPacket packet = (SingleButtonPressPacket) packetClientData.packet;
		for(Player player : players) {
			if(player.teamPlayer.team == packet.getTeam() && player.teamPlayer.player == packet.getPlayer()) {
				player.playerVM.setBlockPacket(packet);
				player.playerVM.setBlock(false);
			}
		}
		
	}
	
	private void UserConnect(PacketClientData packetClientData) {
		
		//Get the connect packet
		ConnectPacket connectPacket = (ConnectPacket) packetClientData.packet;
		
		//Get the user from the db
		Username username = entityManager.getEntityManager().find(Username.class, connectPacket.getUsername());
		
		//Check to make sure the player doesnt already exist in the game
		for(Player player : players) {
			if(player.usernameClientData.username.getUsernameId().equals(username.getUsernameId())) {
				//User already exists in the game, maybe they are trying to reconnect?
			}
		}
		
		//See if the team they are trying to join is full
		int count = 1;
		for(Player player : players) {
			if(player.teamPlayer.team == connectPacket.getTeamNumber()) { count++; }
		}
		if(count >= game.getTeamCount() + 1) {
			//Team is full, handle
		}
		
		//They passed our tests, they can join
		UsernameClientData usernameClientData = new UsernameClientData(username, packetClientData.clientData);
		
		//Get the team palyer
		TeamPlayer teamPlayer = new TeamPlayer(connectPacket.getTeamNumber(), count);
		
		//Store the player data
		Player player = new Player(usernameClientData, teamPlayer, StartPlayerVM(usernameClientData, teamPlayer));
		
		//Add the player to a list
		players.add(player);

		//Send the packet
		packetDistributor.AddPacketToSend(new ConnectAcceptedPacket(getGameInstanceId(), player.teamPlayer.team, player.teamPlayer.player), packetClientData.clientData);
	}
	
	private PlayerVM StartPlayerVM(UsernameClientData usernameClientData, TeamPlayer teamPlayer) {
		
		FileReader fileReader = null;
		
		//Get the filename of script for the game
		try {
			fileReader = new FileReader("programs/test2.js");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		PlayerVM playerVM = new PlayerVM(this, usernameClientData, fileReader, teamPlayer.team, teamPlayer.player);
		playerVM.start();	
		
		return playerVM;
		
		//usernameVMs.put(usernameClientData, playerVM);
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

	public PacketDistributorTask getPacketDistributor() {
		return packetDistributor;
	}
	
}
