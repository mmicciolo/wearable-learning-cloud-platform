package wlcp.transpiler.state;

import java.util.Map;

import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.State;
import wlcp.transpiler.helper.TranspilerHelpers;

public class DisplayTextStateType extends StateType implements IStateType {

	@Override
	public String GenerateState(String scope, State state) {
		StringBuilder stringBuilder = new StringBuilder();
		Map<String, String> displayText = ((OutputState) state).getDisplayText();
		if(displayText.containsKey(scope)) {
			stringBuilder.append(StateType.GenerateStateConditional(scope));
			if(scope.equals("Game Wide")) {
				stringBuilder.append("      " + "this.playerVM.DisplayText(" + "\"" + TranspilerHelpers.ReplaceEscapeSequences(displayText.get(scope)) + "\"" + ");\n");
			} else {
				stringBuilder.append("         " + "this.playerVM.DisplayText(" + "\"" + TranspilerHelpers.ReplaceEscapeSequences(displayText.get(scope)) + "\"" + ");\n");
			}
			stringBuilder.append(StateType.GenerateEndStateConditional(scope));
			return stringBuilder.toString();
		}
		return stringBuilder.toString();
	}

}
