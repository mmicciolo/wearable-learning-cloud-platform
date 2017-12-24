package wlcp.webapp.transpiler.transition;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;
import wlcp.webapp.transpiler.transition.TransitionType;

public class SingleButtonPressTransitionType extends TransitionType implements ITransitionType {

	@Override
	public String GenerateTranstion(String scope, Transition transition, Connection connection) {
		StringBuilder stringBuilder = new StringBuilder();
		if(transition.getSingleButtonPresses().containsKey(scope)) {
			stringBuilder.append(this.GenerateTransitionConditional(scope, transition));
			stringBuilder.append(GenerateTransitionStateChange(scope, connection));
			stringBuilder.append(GenerateTransitionEndConditional(scope));
		}
		return stringBuilder.toString();
	}
	
	private String GenerateTransitionConditional(String scope, Transition transition) {
		StringBuilder stringBuilder = new StringBuilder();
		if(scope.equals("Game Wide")) {
			stringBuilder.append(GenerateTransitionSingleButtonPress(scope, transition));
		} else if(scope.contains("Team") && !scope.contains("Player")) {
			String[] split = scope.split(" ");
			stringBuilder.append("      " + "if(this.team == " + split[1] + ") {\n");
			stringBuilder.append(GenerateTransitionSingleButtonPress(scope, transition));
		} else {
			String[] split = scope.split(" ");
			stringBuilder.append("      " + "if(this.team == " + split[1] + " && " + "this.player == " + split[3] + ") {\n");
			stringBuilder.append(GenerateTransitionSingleButtonPress(scope, transition));
		}
		return stringBuilder.toString();
	}
	
	private String GenerateTransitionSingleButtonPress( String scope, Transition transition) {
		StringBuilder stringBuilder = new StringBuilder();
		StringBuilder buttonBuilder = new StringBuilder();
		if(transition.getSingleButtonPresses().get(scope).getButton1()) {buttonBuilder.append("1");}
		if(transition.getSingleButtonPresses().get(scope).getButton2()) {buttonBuilder.append("2");}
		if(transition.getSingleButtonPresses().get(scope).getButton3()) {buttonBuilder.append("3");}
		if(transition.getSingleButtonPresses().get(scope).getButton4()) {buttonBuilder.append("4");}
		if(scope.equals("Game Wide")) {
			stringBuilder.append("      " + "if(SingleButtonPress(" + buttonBuilder.toString() + ")) {\n");
		} else {
			stringBuilder.append("         " + "if(SingleButtonPress(" + buttonBuilder.toString() + ")) {\n");
		}
		return stringBuilder.toString();
	}
	
}
