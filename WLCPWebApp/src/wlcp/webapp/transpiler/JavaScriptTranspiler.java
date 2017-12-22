package wlcp.webapp.transpiler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.State;
import wlcp.model.master.transition.Transition;

public class JavaScriptTranspiler {
	
	private StringBuilder stringBuilder = new StringBuilder();
	private EntityManager entityManager = null;
	
	private Game game;
	private StartState startState;
	private List<OutputState> outputStates;
	private List<Connection> connections;
	private List<Transition> transitions;
	
	public JavaScriptTranspiler(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	public boolean Transpile(String gameId) {
		
		//Load the data
		LoadData(gameId);
		
		//Generate the state enum
		GenerateStateEnum();
		
		//Generate the namespace and basic variables
		GenerateNamespace();
		
		//Generate the start function which includes the main FSM control logic
		GenerateStartFunction();
		
		//Generate the state machine
		GenerateStateMachine();
		
		//Generate the state machine functions
		GenerateStateMachineFunctions();
		
		stringBuilder.append("}");
		
		System.out.println(stringBuilder.toString());
		
		return true;
	}
	
	private void LoadData(String gameId) {
		game = entityManager.find(Game.class, gameId);
		startState = entityManager.createQuery("SELECT s FROM StartState s WHERE s.game.gameId = '" + game.getGameId() + "'", StartState.class).getResultList().get(0);
		outputStates = entityManager.createQuery("SELECT s FROM OutputState s WHERE s.game.gameId = '" + game.getGameId() + "'", OutputState.class).getResultList();
		connections = entityManager.createQuery("SELECT s FROM Connection s WHERE s.game.gameId = '" + game.getGameId() + "'", Connection.class).getResultList();
		transitions = entityManager.createQuery("SELECT s FROM Transition s WHERE s.game.gameId = '" + game.getGameId() + "'", Transition.class).getResultList();
	}
	
	private void GenerateStateEnum() {
		for(int stateCount = 0; stateCount < outputStates.size() + 1; stateCount++) {
			if(stateCount == 0) {
				//Special case for start state
				stringBuilder.append("var states = {\n");
				stringBuilder.append("   " + startState.getStateId() + " : " + stateCount +",\n");
			} else {
				stringBuilder.append("   " + outputStates.get(stateCount - 1).getStateId() + " : " + stateCount +",\n");
			}
		}
		stringBuilder.append("};");
		stringBuilder.append("\n\n");
	}
	
	private void GenerateNamespace() {
		stringBuilder.append("var FSMGame = {\n\n");
		stringBuilder.append("   " + "gameInstanceId : 0,\n");
		stringBuilder.append("   " + "team : 0,\n");
		stringBuilder.append("   " + "player : 0,\n\n");
		stringBuilder.append("   " + "state : states." + startState.getStateId() + ",\n");
		stringBuilder.append("   " + "oldState : null,\n\n");
	}
	
	private void GenerateStartFunction() {
		stringBuilder.append("   " + "start : function() {\n");
		stringBuilder.append("      " + "while(true) {\n");
		stringBuilder.append("         " + "if(this.state != this.oldState) {\n");
		stringBuilder.append("            " + "this.oldState = this.state;\n");
		stringBuilder.append("            " + "this.stateMachine(this.state);\n");
		stringBuilder.append("         " + "}\n");
		stringBuilder.append("      " + "}\n");
		stringBuilder.append("   " + "},\n\n");
	}
	
	private void GenerateStateMachine() {
		stringBuilder.append("   " + "stateMachine : function(state) {\n");
		stringBuilder.append("      " + "switch(state) {\n");
		for(int stateCount = 0; stateCount < outputStates.size() + 1; stateCount++) {
			if(stateCount == 0) {
				stringBuilder.append("         " + "case states." + startState.getStateId() +":\n");
				stringBuilder.append("            " + "this." + startState.getStateId() + "();\n");
				stringBuilder.append("            " + "break;\n");
			} else {
				stringBuilder.append("         " + "case states." + outputStates.get(stateCount - 1).getStateId() +":\n");
				stringBuilder.append("            " + "this." + outputStates.get(stateCount - 1).getStateId() + "();\n");
				stringBuilder.append("            " + "break;\n");
			}
		}
		stringBuilder.append("      " + "}\n");
		stringBuilder.append("   " + "},\n\n");
	}
	
	private void GenerateStateMachineFunctions() {
		
		//Loop through every state in the machine
		for(int stateCount = 0; stateCount < outputStates.size() + 1; stateCount++) {
			
			//Special case
			if(stateCount == 0) {
				GenerateFunctions(startState);
			} else {
				GenerateFunctions(outputStates.get(stateCount - 1));
			}
		}
	}
	
	private List<Connection> GetFromConnections(State state) {
		List<Connection> fromConnections = new ArrayList<Connection>();
		for(Connection connection : connections) {
			if(connection.getConnectionFrom().equals(state.getStateId())) {
				fromConnections.add(connection);
			}
		}
		return fromConnections;
	}
	
	private Transition GetConnectionTransition(Connection connection) {
		for(Transition transition : transitions) {
			if(transition.getConnection().equals(connection.getConnectionId())) {
				return transition;
			}
		}
		return null;
	}
	
	private State GetToState(Connection connection) {
		for(State state : outputStates) {
			if(state.getStateId().equals(connection.getConnectionTo())) {
				return state;
			}
		}
		return null;
	}
	
	private void GenerateFunctions(State state) {
		
		//Get a list of connections for that state
		List<Connection> fromConnections = GetFromConnections(state);
		
		//If there are no connections
		if(fromConnections.size() == 0) {
			GenerateNoConnections(state);
		} else if(fromConnections.size() == 1) { //If there is only one connection...
			
			Transition transition;
			
			//And no transition, go right there
			if((transition = GetConnectionTransition(fromConnections.get(0))) == null) {
				GenerateSingleConnectionNoTransition(state, fromConnections.get(0));
			} else {
				//Else generate the transition conditional
				GenerateSingleConnectionSingleTransition(state, fromConnections.get(0), transition);
			}
			
		} else if(fromConnections.size() > 1) { //If there is more than one connection
		
			List<Connection> withoutTransitions = new ArrayList<Connection>();
			List<Connection> withTransitions = new ArrayList<Connection>();
			GenerateMethodSignature(state);
			GenerateOutputState(state);

			//Loop through the connections
			for(Connection connection : fromConnections) {
				Transition transition;
				if((transition = GetConnectionTransition(connection)) != null) {
					
					//If the connection has a transition...
				} else {
					
					//If there are no transitions on the connection
					//We need to look ahead at the state
					GenerateMultipleConnectionsNoTransition(connection);
				}
			}
		}
	}
	
	private void GenerateOutputState(State state) {
		if(state instanceof StartState) {return;}
		OutputState outputState = (OutputState) state;
		for(String s : GenerateScope(3,3)) {
			if(outputState.getDisplayText().containsKey(s)) {
				GenerateStateConditional(s);
				GenerateOutputStateDisplayText(s, outputState.getDisplayText());
				GenerateEndStateConditional(s);
			}
		}
	}
	
	private void GenerateOutputStateDisplayText(String scope, Map<String, String> displayText) {
		if(scope.equals("Game Wide")) {
			stringBuilder.append("      " + "DisplayText(this.team, this.player, " + "\"" + displayText.get(scope) + "\"" + ");\n");
		} else {
			stringBuilder.append("         " + "DisplayText(this.team, this.player, " + "\"" + displayText.get(scope) + "\"" + ");\n");
		}
	}
	
	private void GenerateStateConditional(String scope) {
		if(!scope.equals("Game Wide")) {
			if(scope.contains("Team") && !scope.contains("Player")) {
				String[] split = scope.split(" ");
				stringBuilder.append("      " + "if(this.team == " + split[1] + ") {\n");
			} else {
				String[] split = scope.split(" ");
				stringBuilder.append("      " + "if(this.team == " + split[1] + " && " + "this.player == " + split[3] + ") {\n");
			}
		}
	}
	
	private void GenerateEndStateConditional(String scope) {
		if(!scope.equals("Game Wide")) {
			stringBuilder.append("      " + "}\n");
		}
	}
	
	private void GenerateTransition(Transition transition) {
		for(String s : GenerateScope(3,3)) {
//			if(transition.getSingleButtonPresses().containsKey(s)) {
//				GenerateStateConditional(s);
//				GenerateOutputStateDisplayText(s, outputState.getDisplayText());
//				GenerateEndStateConditional(s);
//			}
		}
		stringBuilder.append("      " + "if(SingleButtonPress(" + ")) {\n");
	}
	
	private void GenerateMethodSignature(State state) {
		stringBuilder.append("   " + state.getStateId() + " : function() {\n");
	}
	
	private void GenerateNoConnections(State state) {
		GenerateMethodSignature(state);
		GenerateOutputState(state);
		stringBuilder.append("   " + "},\n\n");
	}
	
	private void GenerateSingleConnectionNoTransition(State state, Connection connection) {
		GenerateMethodSignature(state);
		GenerateOutputState(state);
		stringBuilder.append("      " + "this.state = states." + connection.getConnectionTo() + ";\n");
		stringBuilder.append("   " + "},\n\n");
	}
	
	private void GenerateSingleConnectionSingleTransition(State state, Connection connection, Transition transition) {
		GenerateMethodSignature(state);
		GenerateOutputState(state);
		GenerateTransition(transition);
		stringBuilder.append("   " + "},\n\n");
	}
	
	private void GenerateMultipleConnectionsNoTransition(Connection connection) {
		OutputState nextState = (OutputState) GetToState(connection);
		for(String s : GenerateScope(3,3)) {
			if(stateContainsScope(s, nextState)) {
				GenerateStateConditional(s);
				stringBuilder.append("         " + "this.state = states." + nextState.getStateId() + ";\n");
				GenerateEndStateConditional(s);
			}
		}
	}
	
	private boolean stateContainsScope(String scope, OutputState state) {
		if(state.getDisplayText().containsKey(scope)) {
			return true;
		}
		return false;
	}
	
	private List<String> GenerateScope(int teams, int playersPerTeam) {
		
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

}
