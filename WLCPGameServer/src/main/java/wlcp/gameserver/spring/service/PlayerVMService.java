package wlcp.gameserver.spring.service;

import java.io.FileReader;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import jdk.nashorn.api.scripting.JSObject;
import wlcp.gameserver.model.Player;
import wlcp.shared.message.DisplayTextMessage;
import wlcp.shared.message.IMessage;
import wlcp.shared.message.KeyboardInputMessage;
import wlcp.shared.message.SequenceButtonPressMessage;
import wlcp.shared.message.SingleButtonPressMessage;

@Controller
@Scope("prototype")
public class PlayerVMService extends Thread {
	
	Logger logger = LoggerFactory.getLogger(GameInstanceService.class);
	
	@Autowired
	SimpMessagingTemplate messageTemplate;
	
	private GameInstanceService gameInstanceService;
	private Player player;
	private FileReader fileReader;
	private ScriptEngine scriptEngine;
	private boolean block = true;
	private boolean reconnect = false;
	private boolean shutdown = false;
	private IMessage blockMessage = null;
	private IMessage lastSentPacket = null;
	
	public void setupVariables(GameInstanceService gameInstanceService, Player player, FileReader fileReader) {
		this.gameInstanceService = gameInstanceService;
		this.player = player;
		this.fileReader = fileReader;
		logger.info("PlayerVM for username :" + player.usernameClientData.username.getUsernameId() + " started on game instance: " + gameInstanceService.getGameInstance().getGameInstanceId());
		this.setName("WLCP-" + gameInstanceService.getGame().getGameId() + "-" + gameInstanceService.getGameInstance().getGameInstanceId() + "-" + player.usernameClientData.username.getUsernameId() + "T" + player.teamPlayer.team + "P" + player.teamPlayer.player);
	}

	@Override
	public void run() {
		try {
			startVM();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ScriptException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private void startVM() throws ScriptException, NoSuchMethodException {
		scriptEngine = new ScriptEngineManager().getEngineByName("nashorn");
		scriptEngine.eval(fileReader);
		scriptEngine.eval("FSMGame.gameInstanceId = " + gameInstanceService.getGameInstance().getGameInstanceId() + ";");
		Object json = scriptEngine.get("FSMGame");
		Invocable invocable = (Invocable) scriptEngine;
		invocable.invokeFunction("SetGameVariables", gameInstanceService.getGameInstance().getGameInstanceId(), player.teamPlayer.team + 1, player.teamPlayer.player + 1, this);
		invocable.invokeMethod(json, "start");
	}
	
	public void shutdown() {
		
		//Set the running variable to false
		try {
			scriptEngine.eval("FSMGame.running = false;");
		} catch (ScriptException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//Shutdown
		shutdown = true;
	}
	
	private int block() {
		if(block) {
			if(reconnect) {
				unblock(null);
				reconnect = false;
				try {
					scriptEngine.eval("FSMGame.oldState = FSMGame.oldState - 1");
				} catch (ScriptException e) {
					e.printStackTrace();
				}
				return (int) ((JSObject)scriptEngine.get("FSMGame")).getMember("state");
			}
			if(shutdown) {
				return - 3;
			}
			try {
				Thread.sleep(17);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			return -2;
		}
		return -1;
	}
	
//	public void unblock(IMessage message) {
//		block = false;
//		blockMessage = message;
//	}
	
	public void unblock(IMessage message) {
		if(message == null) { block = false; blockMessage = null; return;}
		if(message.getClass().equals(lastSentPacket.getClass())) {
			block = false;
			blockMessage = message;
		}
	}
	
	public void reconnect() {
		reconnect = true;
	}
	
	public void DisplayText(String text) {
		DisplayTextMessage msg = new DisplayTextMessage();
		msg.displayText = text;
		messageTemplate.convertAndSend("/topic/gameInstance/" + gameInstanceService.getGameInstance().getGameInstanceId() + "/displayText/" + player.usernameClientData.username.getUsernameId() + "/" + player.teamPlayer.team + "/" + player.teamPlayer.player,  msg);
	}
	
	public int SingleButtonPress(String[] buttons, int[] transitions) throws ScriptException {
		block = true;
		SingleButtonPressMessage msg = new SingleButtonPressMessage();
		messageTemplate.convertAndSend("/topic/gameInstance/" + gameInstanceService.getGameInstance().getGameInstanceId() + "/singleButtonPressRequest/" + player.usernameClientData.username.getUsernameId() + "/" + player.teamPlayer.team + "/" + player.teamPlayer.player,  msg);
		lastSentPacket = msg;
		int state;
		while((state = block()) == -2) {}
		if(state != -2 && state != -1) { return state; }
		msg = (SingleButtonPressMessage) blockMessage;
		for(int i = 0; i < buttons.length; i++) {
			if(buttons[i].equals(Integer.toString(msg.buttonPress))) {
				return transitions[i];
			}
		}
		return gotoSameState();
	}
	
	public int SequenceButtonPress(String[] buttons, int[] transitions) {
		block = true;
		SequenceButtonPressMessage msg = new SequenceButtonPressMessage();
		messageTemplate.convertAndSend("/topic/gameInstance/" + gameInstanceService.getGameInstance().getGameInstanceId() + "/sequenceButtonPressRequest/" + player.usernameClientData.username.getUsernameId() + "/" + player.teamPlayer.team + "/" + player.teamPlayer.player,  msg);
		lastSentPacket = msg;
		int state;
		while((state = block()) == -2) {}
		if(state != -2 && state != -1) { return state; }
		msg = (SequenceButtonPressMessage) blockMessage;
		for(int i = 0; i < buttons.length; i++) {
			if(buttons[i].equals(msg.sequenceButtonPress)) {
				return transitions[i];
			}
		}
		for(int i = 0; i < buttons.length; i++) {
			if(buttons[i].equals("")) {
				return transitions[i];
			}
		}
		return gotoSameState();
	}
	
	public int KeyboardInput(String[] keyboardInput, int[] transitions) {
		block = true;
		KeyboardInputMessage msg = new KeyboardInputMessage();
		messageTemplate.convertAndSend("/topic/gameInstance/" + gameInstanceService.getGameInstance().getGameInstanceId() + "/keyboardInputRequest/" + player.usernameClientData.username.getUsernameId() + "/" + player.teamPlayer.team + "/" + player.teamPlayer.player,  msg);
		lastSentPacket = msg;
		int state;
		while((state = block()) == -2) {}
		if(state != -2 && state != -1) { return state; }
		msg = (KeyboardInputMessage) blockMessage;
		for(int i = 0; i < keyboardInput.length; i++) {
			if(keyboardInput[i].equals(msg.keyboardInput)) {
				return transitions[i];
			}
		}
		for(int i = 0; i < keyboardInput.length; i++) {
			if(keyboardInput[i].equals("")) {
				return transitions[i];
			}
		}
		return gotoSameState();
	}
	
	private int gotoSameState() {
		try {
			scriptEngine.eval("FSMGame.oldState = FSMGame.oldState - 1");
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return (int) ((JSObject)scriptEngine.get("FSMGame")).getMember("state");
	}
}
