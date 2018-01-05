package wlcp.transpiler.steps;

import java.util.List;

import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;

public class GenerateStateMachineStep implements ITranspilerStep {

	private StartState startState;
	private List<OutputState> outputStates;
	
	public GenerateStateMachineStep(StartState startState, List<OutputState> outputStates) {
		this.startState = startState;
		this.outputStates = outputStates;
	}
	
	@Override
	public String PerformStep() {
		StringBuilder stringBuilder = new StringBuilder();
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
		return stringBuilder.toString();
	}

}
