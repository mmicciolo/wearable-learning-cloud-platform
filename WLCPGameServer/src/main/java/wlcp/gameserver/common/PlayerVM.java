package wlcp.gameserver.common;

import java.io.FileReader;
import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import javax.script.Invocable;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import wlcp.gameserver.config.Configurations;
import wlcp.gameserver.config.HeartbeatConfiguration;
import wlcp.gameserver.model.ClientData;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.ConfigurationModule;
import wlcp.gameserver.tasks.GameInstanceTask;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packets.DisplayTextPacket;
import wlcp.shared.packets.KeyboardInputPacket;
import wlcp.shared.packets.SequenceButtonPressPacket;
import wlcp.shared.packets.SingleButtonPressPacket;

import jdk.nashorn.api.scripting.*;

public class PlayerVM extends Thread {
	
	private GameInstanceTask gameInstanceTask;
	private UsernameClientData usernameClientData;
	private FileReader fileReader;
	private ScriptEngine scriptEngine;
	private int team;
	private int player;
	private IPacket blockPacket = null;
	private boolean block = true;
	private boolean reconnect = false;
	private boolean shutdown = false;
	private Timer heartbeatTimeoutTimer;
	private TimerTask heartbeatTimeoutTimerTask;
	private boolean heartbeatTimerRunning = false;

	public PlayerVM(GameInstanceTask gameInstanceTask, UsernameClientData usernameClientData, FileReader fileReader, int team, int player) {
		this.gameInstanceTask = gameInstanceTask;
		this.usernameClientData = usernameClientData;
		this.fileReader = fileReader;
		this.team = team;
		this.player = player;
	}
	
	@Override
	public void run() {
		scriptEngine = new ScriptEngineManager().getEngineByName("nashorn");
		try {
			scriptEngine.eval(fileReader);
			scriptEngine.eval("FSMGame.gameInstanceId = " + gameInstanceTask.getGameInstanceId() + ";");
			Object json = scriptEngine.get("FSMGame");
			Invocable invocable = (Invocable) scriptEngine;
			try {
				invocable.invokeFunction("SetGameVariables", gameInstanceTask.getGameInstanceId(), team, player, this);
				invocable.invokeMethod(json, "start");
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (ScriptException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void shutdown() {
		
		//Set the running variable to false
		try {
			scriptEngine.eval("FSMGame.running = false;");
		} catch (ScriptException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		CancelHeartbeatTimeoutTimer();
		
		//Shutdown
		shutdown = true;
	}
	
	public void reconnect(ClientData clientData) {
		this.usernameClientData.clientData = clientData;
		reconnect = true;
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
	
	public void unblock(IPacket packet) {
		block = false;
		blockPacket = packet;
	}
	
	public void StartHeartbeatTimeoutTimer() {
		PlayerVM that = this;
		heartbeatTimeoutTimerTask = new TimerTask() {
			public void run() {
				CancelHeartbeatTimeoutTimer();
				gameInstanceTask.HandleHeartbeatTimeout(that);
			}
		};
		heartbeatTimeoutTimer = new Timer("Timer");
		ConfigurationModule config = (ConfigurationModule) ModuleManager.getInstance().getModule(Modules.CONFIGURATION);
		HeartbeatConfiguration c = (HeartbeatConfiguration) config.getConfiguration(Configurations.HEARTBEAT);
		heartbeatTimeoutTimer.schedule(heartbeatTimeoutTimerTask, c.getHeartBeatTimeoutTime());
		heartbeatTimerRunning = true;
	}
	
	public void CancelHeartbeatTimeoutTimer() {
		if(heartbeatTimerRunning) {
			heartbeatTimeoutTimer.cancel();
			heartbeatTimeoutTimerTask.cancel();
			heartbeatTimerRunning = false;
		}
	}
	
	public void DisplayText(String text) {
		gameInstanceTask.getPacketDistributor().AddPacketToSend(new DisplayTextPacket(text), usernameClientData.clientData);
	}
	
	public void DisplayText2(String text) {
		System.out.println(text);
	}
	
	public int SingleButtonPress(String[] buttons, int[] transitions) throws ScriptException {
		block = true;
		gameInstanceTask.getPacketDistributor().AddPacketToSend(new SingleButtonPressPacket(gameInstanceTask.getGameInstanceId(), team, player, 0), usernameClientData.clientData);
		int state;
		while((state = block()) == -2) {}
		if(state != -2 && state != -1) { return state; }
		SingleButtonPressPacket packet = (SingleButtonPressPacket) blockPacket;
		for(int i = 0; i < buttons.length; i++) {
			if(buttons[i].equals(Integer.toString(packet.getButtonPress()))) {
				return transitions[i];
			}
		}
		try {
			scriptEngine.eval("FSMGame.oldState = FSMGame.oldState - 1");
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return (int) ((JSObject)scriptEngine.get("FSMGame")).getMember("state");
		//return -1;
	}
	
	public int SequenceButtonPress(String[] buttons, int[] transitions) throws ScriptException {
		block = true;
		gameInstanceTask.getPacketDistributor().AddPacketToSend(new SequenceButtonPressPacket(gameInstanceTask.getGameInstanceId(), team, player, ""), usernameClientData.clientData);
		int state;
		while((state = block()) == -2) {}
		if(state != -2 && state != -1) { return state; }
		SequenceButtonPressPacket packet = (SequenceButtonPressPacket) blockPacket;
		for(int i = 0; i < buttons.length; i++) {
			if(buttons[i].equals(packet.getSequenceButtonPress())) {
				return transitions[i];
			}
		}
		for(int i = 0; i < buttons.length; i++) {
			if(buttons[i].equals("")) {
				return transitions[i];
			}
		}
		return -1;
	}
	
	public int KeyboardInput(String[] keyboardInput, int[] transitions) throws ScriptException {
		block = true;
		gameInstanceTask.getPacketDistributor().AddPacketToSend(new KeyboardInputPacket(gameInstanceTask.getGameInstanceId(), team, player, ""), usernameClientData.clientData);
		int state;
		while((state = block()) == -2) {}
		if(state != -2 && state != -1) { return state; }
		KeyboardInputPacket packet = (KeyboardInputPacket) blockPacket;
		for(int i = 0; i < keyboardInput.length; i++) {
			if(keyboardInput[i].equals(packet.getKeyboardInput())) {
				return transitions[i];
			}
		}
		for(int i = 0; i < keyboardInput.length; i++) {
			if(keyboardInput[i].equals("")) {
				return transitions[i];
			}
		}
		return -1;
	}
	
	public int SingleButtonPress2(String[] buttons, int[] transitions) {
		int press = -1;
		while(true) {
			try {
				if(press != 13 && press != 10) {
					System.out.print("Push a button: ");
				}
				press = System.in.read();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			for(int i = 0; i < buttons.length; i++) {
				if(buttons[i].equals(Character.toString((char)press))) {
					return transitions[i];
				}
			}
		}
	}

	public void setBlockPacket(IPacket blockPacket) {
		this.blockPacket = blockPacket;
	}

	public void setBlock(boolean block) {
		this.block = block;
	}

	public boolean isHeartbeatTimerRunning() {
		return heartbeatTimerRunning;
	}

}
