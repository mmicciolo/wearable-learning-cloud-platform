package wlcp.gameserver.vm;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class VirtualMachine {
	
	private ScriptEngine scriptEngine;
	
	public VirtualMachine() {
		
	}
	
	public void Start(String fileName) {
		scriptEngine = new ScriptEngineManager().getEngineByName("nashorn");
		try {
			System.out.println("Starting VM...");
			scriptEngine.eval(new FileReader(fileName));
			Object json = scriptEngine.get("FSMGame");
			Invocable invocable = (Invocable) scriptEngine;
			try {
				invocable.invokeMethod(json, "start");
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ScriptException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void DisplayText(int team, int player, String text) {
		System.out.println("Team: " + team + " Player: 0" + " Text: " + text);
	}
	
	public static int SingleButtonPress(String[] buttons, int[] transitions) {
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
}
