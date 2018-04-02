package wlcp.transpiler.transition;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;
import wlcp.transpiler.helper.TranspilerHelpers;

public class KeyboardInputTransitionType extends TransitionType implements ITransitionType {
	
	@Override
	public String GenerateTranstion(String scope, Map<Connection, Transition> connectionTransitions) {
		StringBuilder stringBuilder = new StringBuilder();
		Map<String, String> keyboardInputMap = GenerateKeyboardInputMap(scope, connectionTransitions);
		if(keyboardInputMap.size() > 0) {
			stringBuilder.append(GenerateTransitionConditional(scope));
			stringBuilder.append(GenerateTransitionKeyboardInput(scope, keyboardInputMap));
			stringBuilder.append(GenerateTransitionEndConditional(scope));
		}
		return stringBuilder.toString();
	}
	
	public Map<String, String> GenerateKeyboardInputMap(String scope, Map<Connection, Transition> connectionTransitions) {
		Map<String, String> keyboardInputMap = new HashMap<String, String>();
		for(Entry<Connection, Transition> entry : connectionTransitions.entrySet()) {
			if(entry.getValue().getKeyboardInputs().containsKey(scope)) {
				for(String keyboardInput : entry.getValue().getKeyboardInputs().get(scope).getKeyboardInputs()) {
					keyboardInputMap.put(keyboardInput, entry.getKey().getConnectionTo());
				}
			}
		}
		return keyboardInputMap;
	}
	
	private String GenerateTransitionKeyboardInput(String scope, Map<String, String> keyboardInputMap) {
		StringBuilder stringBuilder = new StringBuilder();
		if(scope.equals("Game Wide")) {
			stringBuilder.append("      this.state = this.playerVM.KeyboardInput(" + GenerateArrays(keyboardInputMap) + ");\n");
		} else {
			stringBuilder.append("         this.state = this.playerVM.KeyboardInput(" + GenerateArrays(keyboardInputMap) + ");\n");
		}
		return stringBuilder.toString();
	}
	

	public String GenerateArrays(Map<String, String> keyboardInputMap) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("[");
		int count = 0;
		for(Entry<String, String> entry : keyboardInputMap.entrySet()) {
			if(count == keyboardInputMap.size() - 1) {
				stringBuilder.append("\"" + TranspilerHelpers.ReplaceEscapeSequences(entry.getKey()) + "\"], [");
			} else {
				stringBuilder.append("\"" + TranspilerHelpers.ReplaceEscapeSequences(entry.getKey()) + "\", ");
			}
			count++;
		}
		count = 0;
		for(Entry<String, String> entry : keyboardInputMap.entrySet()) {
			if(count == keyboardInputMap.size() - 1) {
				stringBuilder.append("states." + entry.getValue() + "]");
			} else {
				stringBuilder.append("states." + entry.getValue() + ", ");
			}
			count++;
		}
		return stringBuilder.toString();
	}
}
