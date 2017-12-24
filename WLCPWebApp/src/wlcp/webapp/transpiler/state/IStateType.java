package wlcp.webapp.transpiler.state;

import wlcp.model.master.state.State;

public interface IStateType {

	public String GenerateState(String scope, State state);
}
