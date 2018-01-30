package wlcp.gameserver.tasks;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
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
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;
import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectPacket;
import wlcp.shared.packets.DisconnectCompletePacket;
import wlcp.shared.packets.DisconnectPacket;
import wlcp.shared.packets.GameTeamsPacket;
import wlcp.shared.packets.HeartBeatPacket;
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
	private LinkedList<PacketClientData> recievedPackets;
	
	private JPAEntityManager entityManager;
	
	private Timer heartbeatTimer;
	private TimerTask heartbeatTimerTask; 
	
	public GameInstanceTask(GameInstance gameInstance, Game game, GameLobby gameLobby) {
		super("Game Instance " + gameInstance.getGameInstanceId());
		this.gameInstance = gameInstance;
		this.game = game;
		this.gameLobby = gameLobby;
		logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER);
		logger.write("Starting the game " + game.getGameId() + " instance id " + gameInstance.getGameInstanceId());
		packetDistributor = (PacketDistributorTask) ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasks().get(0);
		recievedPackets = new LinkedList<PacketClientData>();
		players = new ArrayList<Player>();
		entityManager = new JPAEntityManager();
		heartbeatTimerTask = new TimerTask(){public void run() {SendHeartBeat();}};
		heartbeatTimer = new Timer();
		heartbeatTimer.scheduleAtFixedRate(heartbeatTimerTask, 5000, 5000);
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
		case DISCONNECT:
			UserDisconnect(packetClientData);
			break;
		case HEARTBEAT:
			this.RecieveHeartBeat(packetClientData);
			break;
		case GAME_TEAMS:
			GetTeams(packetClientData);
			break;
		case SINGLE_BUTTON_PRESS:
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
				player.playerVM.unblock(packet);
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
				//Recall the current state function its in
				player.playerVM.reconnect(packetClientData.clientData);
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
		
		//Log the event
		logger.write("user " + player.usernameClientData.username.getUsernameId() + " joined the lobby " + "\"" + gameLobby.getGameLobbyName() + "\"" + " playing " + "\"" + game.getGameId() + "\"");

		//Send the packet
		packetDistributor.AddPacketToSend(new ConnectAcceptedPacket(getGameInstanceId(), player.teamPlayer.team, player.teamPlayer.player), packetClientData.clientData);
	}
	
	private void UserReconnect(PacketClientData packetClientData, Player player) {
		
		//Log the reconnect
		logger.write("Reconnect from: " + player.usernameClientData.username.getUsernameId());
		
		//Set the new client data
		player.usernameClientData.clientData = packetClientData.clientData;
	}
	
	private void UserDisconnect(PacketClientData packetClientData) {
		
		//Get the packet
		DisconnectPacket packet = (DisconnectPacket) packetClientData.packet;
		
		//Find the player
		for(Player player : players) {
			if(player.teamPlayer.team == packet.getTeam() && player.teamPlayer.player == packet.getPlayer()) {
				
				//Log the event
				logger.write("User " + player.usernameClientData.username.getUsernameId() + " is disconnecting...");
				
				//Stop the VM's thread
				player.playerVM.shutdown();
				
				//Remove us from players
				players.remove(player);
				
				//Send a disconnect  complete
				packetDistributor.AddPacketToSend(new DisconnectCompletePacket(), player.usernameClientData.clientData);
				
				break;
			}
		}
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
	}
	
	@Override
	public void Update() {
		try {
			accquire();
			while(recievedPackets.size() > 0) {
				HandlePacket(recievedPackets.remove());
			}
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void SendHeartBeat() {
		if(players.size() > 0) {
			for(Player player : players) {
				HeartBeatPacket packet = new HeartBeatPacket();
				packetDistributor.AddPacketToSend(packet, player.usernameClientData.clientData);
				player.playerVM.StartHeartbeatTimeoutTimer();
			}
			logger.write("Heart Beat");
		}
	}
	
	private void RecieveHeartBeat(PacketClientData packetClientData) {
		
		//Get the packet
		HeartBeatPacket packet = (HeartBeatPacket) packetClientData.packet;
		
		//Loop through the players and update the time of the last heart beat
		for(Player player : players) {
			if(player.teamPlayer.team == packet.getTeam() && player.teamPlayer.player == packet.getPlayer()) {
				player.playerVM.CancelHeartbeatTimeoutTimer();
			}
		}
	}
	
	public void HandleHeartbeatTimeout(PlayerVM playerVM) {
		
		//Shutdown the VM
		playerVM.shutdown();
		
		Player timeoutPlayer = null;
		
		//Remove the player
		List<Player> playersToRemove = new ArrayList<Player>();
		for(Player player : players) {
			if(player.playerVM.equals(playerVM)) {
				playersToRemove.add(player);
				timeoutPlayer = player;
			}
		}
		for(Player player : playersToRemove) {
			players.remove(player);
		}
		
		if(timeoutPlayer != null) {
			
			//Log the event
			logger.write("User " + timeoutPlayer.usernameClientData.username.getUsernameId() + " playing in the lobby " + gameLobby.getGameLobbyName() + " timed out!");
			
			//Close the socket
			try {
				timeoutPlayer.usernameClientData.clientData.getClientSocket().close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
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
