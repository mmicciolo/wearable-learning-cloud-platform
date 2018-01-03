package wlcp.webapp.transpiler.transition;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;
import wlcp.webapp.transpiler.transition.TransitionType;

public class SingleButtonPressTransitionType extends TransitionType implements ITransitionType {

	@Override
	public String GenerateTranstion(String scope, Map<Connection, Transition> connectionTransitions) {
		StringBuilder stringBuilder = new StringBuilder();
		Map<String, String> buttonMap = GenerateButtonMap(scope, connectionTransitions);
		if(buttonMap.size() > 0) {
			stringBuilder.append(GenerateTransitionConditional(scope));
			stringBuilder.append(GenerateTransitionSingleButtonPress(scope, buttonMap));
			stringBuilder.append(GenerateTransitionEndConditional(scope));
		}
		return stringBuilder.toString();
	}
	
	public Map<String, String> GenerateButtonMap(String scope, Map<Connection, Transition> connectionTransitions) {
		Map<String, String> buttonMap = new HashMap<String, String>();
		for(Entry<Connection, Transition> entry : connectionTransitions.entrySet()) {
			if(entry.getValue().getSingleButtonPresses().containsKey(scope)) {
				if(entry.getValue().getSingleButtonPresses().get(scope).getButton1()) {
					buttonMap.put("1", entry.getKey().getConnectionTo());
				}
				if(entry.getValue().getSingleButtonPresses().get(scope).getButton2()) {
					buttonMap.put("2", entry.getKey().getConnectionTo());
				}
				if(entry.getValue().getSingleButtonPresses().get(scope).getButton3()) {
					buttonMap.put("3", entry.getKey().getConnectionTo());
				}
				if(entry.getValue().getSingleButtonPresses().get(scope).getButton4()) {
					buttonMap.put("4", entry.getKey().getConnectionTo());
				}
			}
		}
		return buttonMap;
	}
	
	public String GenerateArrays(Map<String, String> buttonMap) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("[");
		int count = 0;
		for(Entry<String, String> entry : buttonMap.entrySet()) {
			if(count == buttonMap.size() - 1) {
				stringBuilder.append("\"" + entry.getKey() + "\"], [");
			} else {
				stringBuilder.append("\"" + entry.getKey() + "\", ");
			}
			count++;
		}
		count = 0;
		for(Entry<String, String> entry : buttonMap.entrySet()) {
			if(count == buttonMap.size() - 1) {
				stringBuilder.append("states." + entry.getValue() + "]");
			} else {
				stringBuilder.append("states." + entry.getValue() + ", ");
			}
			count++;
		}
		return stringBuilder.toString();
	}
	
	private String GenerateTransitionSingleButtonPress(String scope, Map<String, String> buttonMap) {
		StringBuilder stringBuilder = new StringBuilder();
		GenerateArrays(buttonMap);
		if(scope.equals("Game Wide")) {
			stringBuilder.append("      this.state = SingleButtonPress(" + GenerateArrays(buttonMap) + ");\n");
		} else {
			stringBuilder.append("         this.state = SingleButtonPress(" + GenerateArrays(buttonMap) + ");\n");
		}
		return stringBuilder.toString();
	}
	
}
