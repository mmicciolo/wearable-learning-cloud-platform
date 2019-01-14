package wlcp.gameserver.spring.controller;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import wlcp.gameserver.spring.repository.GameInstanceRepository;
import wlcp.gameserver.spring.repository.GameLobbyRepository;
import wlcp.gameserver.spring.repository.GameRepository;
import wlcp.gameserver.spring.repository.UsernameRepository;
import wlcp.gameserver.spring.service.GameInstanceService;
import wlcp.model.master.GameInstance;
import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;
import wlcp.shared.message.ConnectRequestMessage;
import wlcp.shared.message.IMessage;
import wlcp.shared.message.PlayerAvaliableMessage;

@RestController
@RequestMapping("/controllers")
public class GameInstanceController {
	
	@Autowired
	ApplicationContext context;
	
	@Autowired
	private GameRepository gameRepository;
	
	@Autowired
	private GameLobbyRepository gameLobbyRepository;
	
	@Autowired
	private GameInstanceRepository gameInstanceRepository;
	
	@Autowired
	private UsernameRepository usernameRepository;
	
	@Autowired
	SimpMessagingTemplate messageTemplate;
	
	public CopyOnWriteArrayList<GameInstanceService> gameInstances = new CopyOnWriteArrayList<GameInstanceService>();
	
	@PostConstruct
	public void init() {
		gameInstanceRepository.deleteAll();
	}
	
	@CrossOrigin(origins = "http://localhost:8080")
	@GetMapping(value="/startGameInstance/{gameId}/{gameLobbyId}/{usernameId}")
	public ResponseEntity<String> startGameInstance(@PathVariable String gameId, @PathVariable Integer gameLobbyId, @PathVariable String usernameId) {
		if(gameRepository.existsById(gameId) && gameLobbyRepository.existsById(gameLobbyId) && usernameRepository.existsById(usernameId)) {
			GameInstanceService service = context.getBean(GameInstanceService.class);
			service.setupVariables(gameRepository.getOne(gameId), gameLobbyRepository.getOne(gameLobbyId), usernameRepository.getOne(usernameId), false);
			service.start();
			gameInstances.add(service);
			return ResponseEntity.status(HttpStatus.OK).body("");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("The game " + gameId + " or game lobby " + gameLobbyId + " does not exist, so an insance could not be started!");
		}
	}
	
	@CrossOrigin(origins = "http://localhost:8080")
	@GetMapping(value="/stopGameInstance/{gameInstanceId}")
	public ResponseEntity<String> stopGameInstance(@PathVariable int gameInstanceId) {
		if(gameInstanceRepository.existsById(gameInstanceId)) {
			for(GameInstanceService instance : gameInstances) {
				if(instance.getGameInstance().getGameInstanceId().equals(gameInstanceId)) {
					instance.shutdown();
					gameInstances.remove(instance);
					break;
				}
			}
			return ResponseEntity.status(HttpStatus.OK).body("");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("The game instance: " + gameInstanceId + " does not exist, so it could not be stopped!");
		}
	}
	
	@CrossOrigin(origins = "http://localhost:8080")
	@GetMapping(value="/startDebugGameInstance/{gameId}/{usernameId}/{restart}")
	public ResponseEntity<Integer> startDebugGameInstance(@PathVariable String gameId, @PathVariable String usernameId, @PathVariable Boolean restart) throws InterruptedException {
		if(gameRepository.existsById(gameId) && usernameRepository.existsById(usernameId)) {
			List<GameInstance> foundGameInstances = null;
			if(restart == false) {
				if((foundGameInstances = gameInstanceRepository.findByUsernameAndDebugInstance(new Username(usernameId, "", "", "", ""), true)).size() > 0) {
					for(GameInstanceService instance : gameInstances) {
						if(instance.getGameInstance().getGameInstanceId().equals(foundGameInstances.get(0).getGameInstanceId())) {
							return ResponseEntity.status(HttpStatus.OK).body(instance.getGameInstance().getGameInstanceId());
						}
					}
				}
			}
			if((foundGameInstances = gameInstanceRepository.findByUsernameAndDebugInstance(new Username(usernameId, "", "", "", ""), true)).size() > 0) {
				for(GameInstanceService instance : gameInstances) {
					if(instance.getGameInstance().getGameInstanceId().equals(foundGameInstances.get(0).getGameInstanceId())) {
						instance.shutdown();
						gameInstances.remove(instance);
						break;
					}
				}
				GameInstanceService service = context.getBean(GameInstanceService.class);
				Username username = new Username();
				username.setUsernameId(usernameId);
				service.setupVariables(gameRepository.getOne(gameId), new GameLobby(usernameId + " Debug Lobby", username), usernameRepository.getOne(usernameId), true);
				service.start();
				gameInstances.add(service);
				Thread.sleep(500); //This really should not be done, but were gonna go with it
				return ResponseEntity.status(HttpStatus.OK).body(service.getGameInstance().getGameInstanceId());
			} else {
				GameInstanceService service = context.getBean(GameInstanceService.class);
				Username username = new Username();
				username.setUsernameId(usernameId);
				service.setupVariables(gameRepository.getOne(gameId), new GameLobby(usernameId + " Debug Lobby", username), usernameRepository.getOne(usernameId), true);
				service.start();
				gameInstances.add(service);
				Thread.sleep(500); //This really should not be done, but were gonna go with it
				return ResponseEntity.status(HttpStatus.OK).body(service.getGameInstance().getGameInstanceId());
			}
		}
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1);
	}
	
	@MessageMapping("/gameInstance/{gameInstanceId}/connectToGameInstance/{usernameId}/{team}/{player}")
	//@SendTo("/topic/connectionResult")
	public IMessage connectToGameInstance(@DestinationVariable int gameInstanceId, @DestinationVariable String usernameId, @DestinationVariable int team, @DestinationVariable int player) {
		for(GameInstanceService instance : gameInstances) {
			if(instance.getGameInstance().getGameInstanceId().equals(gameInstanceId)) {
				ConnectRequestMessage msg = new ConnectRequestMessage(); 
				msg.gameInstanceId = gameInstanceId;
				msg.usernameId = usernameId;
				msg.team = team;
				msg.player = player;
				messageTemplate.convertAndSend("/topic/connectionResult/" + usernameId + "/" + team + "/" + player, instance.userConnect(msg));
				//return instance.userConnect(msg);
			}
		}
		return null;
	}
	
	@MessageMapping("/gameInstance/{gameInstanceId}/disconnectFromGameInstance/{usernameId}/{team}/{player}")
	//@SendTo("/topic/disconnectionResult")
	public String disconnectFromGameInstance(@DestinationVariable int gameInstanceId, @DestinationVariable String usernameId, @DestinationVariable int team, @DestinationVariable int player) {
		for(GameInstanceService instance : gameInstances) {
			if(instance.getGameInstance().getGameInstanceId().equals(gameInstanceId)) {
			   instance.userDisconnect(team, player);
			   messageTemplate.convertAndSend("/topic/disconnectionResult/" + usernameId + "/" + team + "/" + player, "{}");
			   //return "";
			}
		}
		return null;
	}
	
	@GetMapping(value="/disconnectFromGameInstance")
	public String disconnectFromGameInstance() {
		return "";
	}
	
	@CrossOrigin(origins = "http://localhost:8080")
	@GetMapping("/playersAvaliable/{gameInstanceId}/{usernameId}")
	public List<PlayerAvaliableMessage> playersAvailable(@PathVariable int gameInstanceId, @PathVariable String usernameId) {
		for(GameInstanceService gameInstance : gameInstances) {
			if(gameInstance.getGameInstance().getGameInstanceId().equals(gameInstanceId)) {
				return gameInstance.getTeamsAndPlayers(usernameId);
			}
		}
		return null;
	}

}

class ConnectToGame {
	public int gameInstanceId;
	public int team;
}
