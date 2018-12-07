package wlcp.gameserver.spring.service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import wlcp.gameserver.model.Player;
import wlcp.gameserver.model.TeamPlayer;
import wlcp.gameserver.model.UsernameClientData;
import wlcp.gameserver.spring.controller.GameInstanceController;
import wlcp.gameserver.spring.repository.GameInstanceRepository;
import wlcp.gameserver.spring.repository.UsernameRepository;
import wlcp.model.master.Game;
import wlcp.model.master.GameInstance;
import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;
import wlcp.shared.message.ConnectRequestMessage;
import wlcp.shared.message.ConnectResponseMessage;
import wlcp.shared.message.IMessage;
import wlcp.shared.message.KeyboardInputMessage;
import wlcp.shared.message.PlayerAvaliableMessage;
import wlcp.shared.message.SequenceButtonPressMessage;
import wlcp.shared.message.SingleButtonPressMessage;
import wlcp.shared.message.ConnectResponseMessage.Code;

@Controller
@RequestMapping("/controllers")
@Scope("prototype")
public class GameInstanceService extends Thread {
	
	Logger logger = LoggerFactory.getLogger(GameInstanceService.class);
	
	@Autowired
	GameInstanceRepository gameInstanceRepository;
	
	@Autowired
	UsernameRepository usernameRepository;
	
	@Autowired
	GameInstanceController gameInstanceController;
	
	@Autowired
	ApplicationContext context;
	
	private Game game;
	private GameLobby gameLobby;
	private Username username;
	private GameInstance gameInstance;
	
	private CopyOnWriteArrayList<IMessage> messages = new CopyOnWriteArrayList<IMessage>();
	private CopyOnWriteArrayList<Player> players = new CopyOnWriteArrayList<Player>();
	
	private boolean running = true;
	
	public void setupVariables(Game game, GameLobby gameLobby, Username username) {
		this.game = game;
		this.gameLobby = gameLobby;
		this.username = username;
	}
	
	@Override
	public void run() {
		setup();
		while(running) {
			for(IMessage message : messages) {
				handleMessage(message);
			}
		}
	}
	
	private void handleMessage(IMessage message) {

	}
	
	private void setup() {
		gameInstance = gameInstanceRepository.save(new GameInstance());
		gameInstance.setGame(game);
		gameInstance.setGameLobby(gameLobby);
		gameInstance.setUsername(username);
		gameInstanceRepository.save(gameInstance);
		gameInstanceRepository.flush();
		logger.info("Game Instance: " + gameInstance.getGameInstanceId() + " started! Playing the game: " + game.getGameId() + " with the game lobby: " + gameLobby.getGameLobbyName());
		this.setName("WLCP-" + game.getGameId() + "-" + gameInstance.getGameInstanceId());
	}
	
	public ConnectResponseMessage userConnect(ConnectRequestMessage connect) {
		
		//Get the user from the db
		Username username = usernameRepository.getOne(connect.usernameId);
		
		//Check to make sure the player doesnt already exist in the game (for reconnect)
		for(Player player : players) {
			if(player.usernameClientData.username.getUsernameId().equals(username.getUsernameId())) {
				//User already exists in the game, maybe they are trying to reconnect?
				player.playerVM.reconnect();
				ConnectResponseMessage msg = new ConnectResponseMessage();
				msg.code = Code.RECONNECT;
				return msg;
			}
		}
		
		//Check if someone is already occupying their team / player
		for(Player player : players) {
			if(player.teamPlayer.team == connect.team && player.teamPlayer.player == connect.player) {
				//That player already exists!
				ConnectResponseMessage msg = new ConnectResponseMessage();
				msg.code = Code.FAIL;
				return msg;
			}
		}
		
		//They passed our tests, they can join
		UsernameClientData usernameClientData = new UsernameClientData(username);
		
		//Get the team palyer
		TeamPlayer teamPlayer = new TeamPlayer(connect.team, connect.player);
		
		//Store the player data
		Player player = new Player(usernameClientData, teamPlayer);
		player.playerVM = StartPlayerVM(player);
		
		//Add the player to a list
		players.add(player);
		
		//Log the event
		logger.info("user " + player.usernameClientData.username.getUsernameId() + " joined the lobby " + "\"" + gameLobby.getGameLobbyName() + "\"" + " playing " + "\"" + game.getGameId() + "\"");
		
		ConnectResponseMessage msg = new ConnectResponseMessage();
		msg.team = teamPlayer.team;
		msg.player = teamPlayer.player;
		msg.code = Code.SUCCESS;
		return msg;
	}
	
	public void userDisconnect(int team, int playerNum) {
		
		for(Player player : players) {
			if(player.teamPlayer.team == team && player.teamPlayer.player == playerNum) {
				
				//Log the event
				logger.info("User " + player.usernameClientData.username.getUsernameId() + " is disconnecting...");
				
				//Stop the VM's thread
				player.playerVM.shutdown();

				//Remove the player
				players.remove(player);
				
				break;
			}
		}
	}
	
	private PlayerVMService StartPlayerVM(Player player) {
		
		FileReader fileReader = null;
		
		//Get the filename of script for the game
		try {
			fileReader = new FileReader("programs/" + game.getGameId() + ".js");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		PlayerVMService service = context.getBean(PlayerVMService.class);
		service.setupVariables(this, player, fileReader);
		service.start();
		
		return service;
	}
		
	public List<PlayerAvaliableMessage> getTeamsAndPlayers(String usernameId) {

		List<PlayerAvaliableMessage> teamPlayers = new ArrayList<PlayerAvaliableMessage>();
		
		for(Player player : players) {
			if(player.usernameClientData.username.getUsernameId().equals(usernameId)) {
				PlayerAvaliableMessage msg = new PlayerAvaliableMessage();
				msg.team = player.teamPlayer.team;
				msg.player = player.teamPlayer.player;
				teamPlayers.add(msg);
				return teamPlayers;
			}
		}
		
		for(int i = 0; i < game.getTeamCount(); i++) {
			for(int n = 0; n < game.getPlayersPerTeam(); n++) {
				boolean alreadyExists = false;
				for(Player p : players) {
					if(p.teamPlayer.team == i && p.teamPlayer.player == n) {
						alreadyExists = true;
					}
				}
				if(!alreadyExists) {
					PlayerAvaliableMessage msg = new PlayerAvaliableMessage();
					msg.team = i;
					msg.player = n;
					teamPlayers.add(msg);
				}
			}
		}
		
		return teamPlayers;
	}
	
	public void shutdown() {
		for(Player player : players) {
			player.playerVM.shutdown();
		}
		running = false;
		gameInstanceRepository.delete(gameInstance);
		gameInstanceRepository.flush();
	}
	
	@MessageMapping("/gameInstance/{gameInstanceId}/singleButtonPress/{usernameId}/{team}/{player}")
	public String singleButtonPress(@DestinationVariable int gameInstanceId, @DestinationVariable String usernameId, @DestinationVariable int team, @DestinationVariable int player, @RequestBody SingleButtonPressMessage msg) {
		for(GameInstanceService gameInstance : gameInstanceController.gameInstances) {
			if(gameInstance.getGameInstance().getGameInstanceId().equals(gameInstanceId)) {
				for(Player p : gameInstance.players) {
					if(p.teamPlayer.team == team && p.teamPlayer.player == player) {
						p.playerVM.unblock(msg);
					}
				}
			}
		}
		return "";
	}
	
	@MessageMapping("/gameInstance/{gameInstanceId}/sequenceButtonPress/{usernameId}/{team}/{player}")
	public String sequenceButtonPress(@DestinationVariable int gameInstanceId, @DestinationVariable String usernameId, @DestinationVariable int team, @DestinationVariable int player, @RequestBody SequenceButtonPressMessage msg) {
		for(GameInstanceService gameInstance : gameInstanceController.gameInstances) {
			if(gameInstance.getGameInstance().getGameInstanceId().equals(gameInstanceId)) {
				for(Player p : gameInstance.players) {
					if(p.teamPlayer.team == team && p.teamPlayer.player == player) {
						p.playerVM.unblock(msg);
					}
				}
			}
		}
		return "";
	}
	
	@MessageMapping("/gameInstance/{gameInstanceId}/keyboardInput/{usernameId}/{team}/{player}")
	public String keyboardInput(@DestinationVariable int gameInstanceId, @DestinationVariable String usernameId, @DestinationVariable int team, @DestinationVariable int player, @RequestBody KeyboardInputMessage msg) {
		for(GameInstanceService gameInstance : gameInstanceController.gameInstances) {
			if(gameInstance.getGameInstance().getGameInstanceId().equals(gameInstanceId)) {
				for(Player p : gameInstance.players) {
					if(p.teamPlayer.team == team && p.teamPlayer.player == player) {
						p.playerVM.unblock(msg);
					}
				}
			}
		}
		return "";
	}
	
	public void addMessage(IMessage message) {
		this.messages.add(message);
	}

	public Game getGame() {
		return game;
	}

	public GameLobby getGameLobby() {
		return gameLobby;
	}

	public Username getUsername() {
		return username;
	}

	public GameInstance getGameInstance() {
		return gameInstance;
	}

}
