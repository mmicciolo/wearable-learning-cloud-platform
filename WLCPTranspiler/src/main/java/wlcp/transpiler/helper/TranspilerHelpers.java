package wlcp.transpiler.helper;

import java.util.ArrayList;
import java.util.List;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.State;
import wlcp.model.master.transition.Transition;

public class TranspilerHelpers {
	
	public static List<Connection> GetFromConnections(List<Connection> connections, State state) {
		List<Connection> fromConnections = new ArrayList<Connection>();
		for(Connection connection : connections) {
			if(connection.getConnectionFrom().getStateId().equals(state.getStateId())) {
				fromConnections.add(connection);
			}
		}
		return fromConnections;
	}
	
	public static Transition GetConnectionTransition(List<Transition> transitions, Connection connection) {
		for(Transition transition : transitions) {
			if(transition.getConnection().getConnectionId().equals(connection.getConnectionId())) {
				return transition;
			}
		}
		return null;
	}
	
	public static State GetToState(List<OutputState> outputStates, Connection connection) {
		for(State state : outputStates) {
			if(state.getStateId().equals(connection.getConnectionTo().getStateId())) {
				return state;
			}
		}
		return null;
	}
	
	public static boolean stateContainsScope(String scope, OutputState state) {
		if(state.getDisplayText().containsKey(scope)) {
			return true;
		}
		return false;
	}
	
	public static List<String> GenerateScope(int teams, int playersPerTeam) {
		
		List<String> scope = new ArrayList<String>();

		//Add game wide
		scope.add("Game Wide");
		
		//Add the teams
		for(int i = 0; i < teams; i++) {
			scope.add("Team " + (i + 1));
		}
		
		//Add the players
		for(int i = 0; i < teams; i++) {
			for(int n = 0; n < playersPerTeam; n++) {
				scope.add("Team " + (i + 1) + " Player " + (n + 1));
			}
		}
		return scope;
	}
	
	public static String ReplaceEscapeSequences(String input) {
		String returnString = input;
		returnString = returnString.replace("\\", "\\\\");
		returnString = returnString.replace("\"", "\\\"");
		returnString = returnString.replace("\'", "\\\'");
		returnString = returnString.replace("\n", "\\n");
		returnString = returnString.replace("\r", "\\r");
		return returnString;
	}
}
