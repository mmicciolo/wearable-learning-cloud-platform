package wlcp.gameserver.common;

import java.io.FileReader;
import java.io.IOException;

import javax.script.Invocable;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import wlcp.gameserver.tasks.GameInstanceTask;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packets.DisplayTextPacket;
import wlcp.shared.packets.SingleButtonPressPacket;

public class PlayerVM extends Thread {
	
	private GameInstanceTask gameInstanceTask;
	private UsernameClientData usernameClientData;
	private FileReader fileReader;
	private ScriptEngine scriptEngine;
	private int team;
	private int player;
	private IPacket blockPacket = null;
	private boolean block = true;

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
	
	public void DisplayText(String text) {
		gameInstanceTask.getPacketDistributor().AddPacketToSend(new DisplayTextPacket(text), usernameClientData.clientData);
	}
	
	public void DisplayText2(String text) {
		System.out.println(text);
	}
	
	public int SingleButtonPress(String[] buttons, int[] transitions) {
		block = true;
		gameInstanceTask.getPacketDistributor().AddPacketToSend(new SingleButtonPressPacket(gameInstanceTask.getGameInstanceId(), team, player, 0), usernameClientData.clientData);
		while(block) { try {
			Thread.sleep(17);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}}
		System.out.println("Done Blocking");
		SingleButtonPressPacket packet = (SingleButtonPressPacket) blockPacket;
		for(int i = 0; i < buttons.length; i++) {
			if(buttons[i].equals(Integer.toString(packet.getButtonPress()))) {
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
	
	
	
}
