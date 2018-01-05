package wlcp.transpiler.steps;

import java.util.List;

import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;

public class GenerateStateEnumStep implements ITranspilerStep {
	
	private StartState startState;
	private List<OutputState> outputStates;

	public GenerateStateEnumStep(StartState startState, List<OutputState> outputStates) {
		this.startState = startState;
		this.outputStates = outputStates;
	}
	
	@Override
	public String PerformStep() {
		StringBuilder stringBuilder = new StringBuilder();
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
		return stringBuilder.toString();
	}

}
