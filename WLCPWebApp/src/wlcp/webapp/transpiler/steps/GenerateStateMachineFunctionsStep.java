package wlcp.webapp.transpiler.steps;

import java.util.ArrayList;
import java.util.List;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.State;
import wlcp.model.master.transition.Transition;
import wlcp.webapp.transpiler.helper.TranspilerHelpers;
import wlcp.webapp.transpiler.state.DisplayTextStateType;
import wlcp.webapp.transpiler.state.IStateType;
import wlcp.webapp.transpiler.state.StateType;
import wlcp.webapp.transpiler.transition.ITransitionType;
import wlcp.webapp.transpiler.transition.SingleButtonPressTransitionType;

public class GenerateStateMachineFunctionsStep implements ITranspilerStep {
	
	private StringBuilder stringBuilder = new StringBuilder();
	private StartState startState;
	private List<OutputState> outputStates;
	private List<Connection> connections;
	private List<Transition> transitions;
	private List<IStateType> stateTypes = new ArrayList<IStateType>();
	private List<ITransitionType> transitionTypes = new ArrayList<ITransitionType>();
	
	public GenerateStateMachineFunctionsStep(StartState startState, List<OutputState> outputStates, List<Connection> connections, List<Transition> transitions) {
		this.startState = startState;
		this.outputStates = outputStates;
		this.connections = connections;
		this.transitions = transitions;
	}

	@Override
	public String PerformStep() {
		
		//Setup the state and transition types
		SetupTypes();
		
		//Loop through every state in the machine
		for(int stateCount = 0; stateCount < outputStates.size() + 1; stateCount++) {
			
			//Special case
			if(stateCount == 0) {
				GenerateFunctions(startState);
			} else {
				GenerateFunctions(outputStates.get(stateCount - 1));
			}
		}
		stringBuilder.append("}");
		return stringBuilder.toString();
	}
	
	private void SetupTypes() {
		stateTypes.add(new DisplayTextStateType());
		transitionTypes.add(new SingleButtonPressTransitionType());
	}
	
	private void GenerateFunctions(State state) {
		
		//Get a list of connections for that state
		List<Connection> fromConnections = TranspilerHelpers.GetFromConnections(connections, state);
		
		//If there are no connections
		if(fromConnections.size() == 0) {
			GenerateNoConnections(state);
		} else if(fromConnections.size() == 1) { //If there is only one connection...
			
			Transition transition;
			
			//And no transition, go right there
			if((transition = TranspilerHelpers.GetConnectionTransition(transitions, fromConnections.get(0))) == null) {
				GenerateSingleConnectionNoTransition(state, fromConnections.get(0));
			} else {
				//Else generate the transition conditional
				GenerateSingleConnectionSingleTransition(state, fromConnections.get(0), transition);
			}
			
		} else if(fromConnections.size() > 1) { //If there is more than one connection
		
			GenerateMethodSignature(state);
			GenerateOutputState(state);

			//Loop through the connections
			for(Connection connection : fromConnections) {
				Transition transition;
				if((transition = TranspilerHelpers.GetConnectionTransition(transitions, connection)) != null) {
					
					//If the connection has a transition...
					GenerateMultipleConnectionsSingleTransition(state, connection, transition);
				} else {
					
					//If there are no transitions on the connection
					//We need to look ahead at the state
					GenerateMultipleConnectionsNoTransition(connection);
				}
			}
			
			stringBuilder.append("   " + "},\n\n");
		}
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
		GenerateTransition(transition, connection);
		stringBuilder.append("   " + "},\n\n");
	}
	
	private void GenerateMultipleConnectionsNoTransition(Connection connection) {
		OutputState nextState = (OutputState) TranspilerHelpers.GetToState(outputStates, connection);
		for(String s : TranspilerHelpers.GenerateScope(3,3)) {
			if(TranspilerHelpers.stateContainsScope(s, nextState)) {
				stringBuilder.append(StateType.GenerateStateConditional(s));
				stringBuilder.append("         " + "this.state = states." + nextState.getStateId() + ";\n");
				stringBuilder.append(StateType.GenerateEndStateConditional(s));
			}
		}
	}
	
	private void GenerateMultipleConnectionsSingleTransition(State state, Connection connection, Transition transition) {
		GenerateTransition(transition, connection);
	}
	
	private void GenerateOutputState(State state) {
		if(state instanceof StartState) {return;}
		for(String s : TranspilerHelpers.GenerateScope(3,3)) {
			for(IStateType stateType : stateTypes) {
				stringBuilder.append(stateType.GenerateState(s, state));
			}
		}
	}
	
	private void GenerateTransition(Transition transition, Connection connection) {
		for(String s : TranspilerHelpers.GenerateScope(3,3)) {
			for(ITransitionType transitionType : transitionTypes) {
				stringBuilder.append(transitionType.GenerateTranstion(s, transition, connection));
			}
		}
	}
	
	private void GenerateMethodSignature(State state) {
		stringBuilder.append("   " + state.getStateId() + " : function() {\n");
	}

}
