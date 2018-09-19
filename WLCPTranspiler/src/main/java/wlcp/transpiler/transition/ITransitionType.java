package wlcp.transpiler.transition;

import java.util.Map;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;

public interface ITransitionType {
	
	public String GenerateTranstion(String scope, Map<Connection, Transition> connectionTransitions);
	
}
