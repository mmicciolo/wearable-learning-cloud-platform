package wlcp.transpiler.transition;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;

public class SequenceButtonPressTransitionType extends TransitionType implements ITransitionType {
	
	@Override
	public String GenerateTranstion(String scope, Map<Connection, Transition> connectionTransitions) {
		StringBuilder stringBuilder = new StringBuilder();
		Map<String, String> sequenceMap = GenerateSequenceMap(scope, connectionTransitions);
		if(sequenceMap.size() > 0) {
			stringBuilder.append(GenerateTransitionConditional(scope));
			stringBuilder.append(GenerateTransitionSequenceButtonPress(scope, sequenceMap));
			stringBuilder.append(GenerateTransitionEndConditional(scope));
		}
		return stringBuilder.toString();
	}
	
	public Map<String, String> GenerateSequenceMap(String scope, Map<Connection, Transition> connectionTransitions) {
		Map<String, String> sequenceMap = new HashMap<String, String>();
		for(Entry<Connection, Transition> entry : connectionTransitions.entrySet()) {
			if(entry.getValue().getSequenceButtonPresses().containsKey(scope)) {
				for(String sequence : entry.getValue().getSequenceButtonPresses().get(scope).getSequences()) {
					sequenceMap.put(sequence, entry.getKey().getConnectionTo());
				}
			}
		}
		return sequenceMap;
	}
	
	private String GenerateTransitionSequenceButtonPress(String scope, Map<String, String> sequenceMap) {
		StringBuilder stringBuilder = new StringBuilder();
		if(scope.equals("Game Wide")) {
			stringBuilder.append("      this.state = this.playerVM.SequenceButtonPress(" + GenerateArrays(sequenceMap) + ");\n");
		} else {
			stringBuilder.append("         this.state = this.playerVM.SequenceButtonPress(" + GenerateArrays(sequenceMap) + ");\n");
		}
		return stringBuilder.toString();
	}
	
	public String GenerateArrays(Map<String, String> sequenceMap) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("[");
		int count = 0;
		for(Entry<String, String> entry : sequenceMap.entrySet()) {
			if(count == sequenceMap.size() - 1) {
				stringBuilder.append("\"" + entry.getKey() + "\"], [");
			} else {
				stringBuilder.append("\"" + entry.getKey() + "\", ");
			}
			count++;
		}
		count = 0;
		for(Entry<String, String> entry : sequenceMap.entrySet()) {
			if(count == sequenceMap.size() - 1) {
				stringBuilder.append("states." + entry.getValue() + "]");
			} else {
				stringBuilder.append("states." + entry.getValue() + ", ");
			}
			count++;
		}
		return stringBuilder.toString();
	}
}
