package wlcp.webapp.transpiler.transition;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;

public class TransitionType implements ITransitionType {

	@Override
	public String GenerateTranstion(String scope, Transition transition, Connection connection) {
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
	
	public static String GenerateTransitionEndConditional(String scope) {
		StringBuilder stringBuilder = new StringBuilder();
		if(scope.equals("Game Wide")) {
			stringBuilder.append("      " + "}\n");
		} else {
			stringBuilder.append("         " + "}\n");
			stringBuilder.append("      " + "}\n");
		}
		return stringBuilder.toString();
	}
	
}
