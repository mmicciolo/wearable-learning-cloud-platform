package wlcp.webapp.transpiler.transition;

import java.util.Map;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;

public class TransitionType implements ITransitionType {

	@Override
	public String GenerateTranstion(String scope, Map<Connection, Transition> connectionTransitions) {
		return "";
	}
	
	public static String GenerateTransitionStateChange(String scope, Connection connection) {
		StringBuilder stringBuilder = new StringBuilder();
		if(scope.equals("Game Wide")) {
			stringBuilder.append("         " + "this.state = states." + connection.getConnectionTo() + ";\n");
		} else {
			stringBuilder.append("            " + "this.state = states." + connection.getConnectionTo() + ";\n");
		}
		return stringBuilder.toString();
	}
	
	public static String GenerateTransitionConditional(String scope) {
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
	
	public static String GenerateTransitionEndConditional(String scope) {
		StringBuilder stringBuilder = new StringBuilder();
		if(!scope.equals("Game Wide")) {
			stringBuilder.append("      " + "}\n");
		}
		return stringBuilder.toString();
	}
	
}
