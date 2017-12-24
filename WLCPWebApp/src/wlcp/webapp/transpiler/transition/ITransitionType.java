package wlcp.webapp.transpiler.transition;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.transition.Transition;

public interface ITransitionType {
	
	public String GenerateTranstion(String scope, Transition transition, Connection connection);
	
}
