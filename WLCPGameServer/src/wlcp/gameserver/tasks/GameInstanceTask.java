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
import wlcp.shared.packets.GameTeamsPacket;
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
		case GAME_TEAMS:
			GetTeams(packetClientData);
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
				UserReconnect(packetClientData, player);
				//Send the packet
				packetDistributor.AddPacketToSend(new ConnectAcceptedPacket(getGameInstanceId(), player.teamPlayer.team, player.teamPlayer.player), packetClientData.clientData);
				return;
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
	
	private void UserReconnect(PacketClientData packetClientData, Player player) {
		
		//Log the reconnect
		logger.write("Reconnect from: " + player.usernameClientData.username.getUsernameId());
		
		//Set the new client data
		player.usernameClientData.clientData = packetClientData.clientData;
		
	}
	
	private void GetTeams(PacketClientData packetClientData) {
		
		//Get the packet
		GameTeamsPacket teams = (GameTeamsPacket) packetClientData.packet;
		
		//Check to see if the username is already connected
		//If it is this is a reconnect situation
		for(Player player : players) {
			if(player.usernameClientData.username.getUsernameId().equals(teams.getUsername())) {
				
				//Set the team to current team
				List<Byte> teamNumbers = new ArrayList<Byte>();
				teamNumbers.add((byte) ((byte)player.teamPlayer.team));
				teams.setTeamNumbers(teamNumbers);
				
				//Send the packet
				packetDistributor.AddPacketToSend(teams, packetClientData.clientData);
				
				//Return
				return;
			}
		}
		
		//Loop through the teams
		int[] playerArray = new int[game.getPlayersPerTeam()];
		for(int i = 0; i < game.getTeamCount(); i++) {
			for(Player p : players) {
				if(p.teamPlayer.team == i) {
					playerArray[p.teamPlayer.team - 1]++;
				}
			}
		}
		
		//Add the teams
		List<Byte> gameTeams = new ArrayList<Byte>();
		for(int i = 0; i < playerArray.length; i++) {
			if(playerArray[i] < game.getPlayersPerTeam()) {
				gameTeams.add((byte)(i + 1));
			}
		}
		
		//Set the team numbers
		teams.setTeamNumbers(gameTeams);
		
		//Send the packet
		packetDistributor.AddPacketToSend(teams, packetClientData.clientData);
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

	public GameInstance getGameInstance() {
		return gameInstance;
	}

	public Game getGame() {
		return game;
	}

	public GameLobby getGameLobby() {
		return gameLobby;
	}
	
}
