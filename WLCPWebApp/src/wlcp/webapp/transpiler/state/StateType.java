package wlcp.webapp.transpiler.state;

import wlcp.model.master.state.State;

public class StateType implements IStateType {

	@Override
	public String GenerateState(String scope, State state) {
		return "";
	}
	
	public static String GenerateStateConditional(String scope) {
		StringBuilder stringBuilder = new StringBuilder();
		if(!scope.equals("Game Wide")) {
			if(scope.contains("Team") && !scope.contains("Player")) {
				String[] split = scope.split(" ");
				stringBuilder.append("      " + "if(this.team == " + split[1] + ") {\n");
			} else {
				String[] split = scope.split(" ");
				stringBuilder.append("      " + "if(this.team == " + split[1] + " && " + "this.player == " + split[3] + ") {\n");
			}
		}
		return stringBuilder.toString();
	}
	
	public static String GenerateEndStateConditional(String scope) {
		StringBuilder stringBuilder = new StringBuilder();
		if(!scope.equals("Game Wide")) {
			stringBuilder.append("      " + "}\n");
		}
		return stringBuilder.toString();
	}

}
