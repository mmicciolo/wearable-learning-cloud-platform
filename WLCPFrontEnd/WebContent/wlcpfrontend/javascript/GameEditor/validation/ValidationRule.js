var ValidationRule = class ValidationRule {
	
	constructor() {
		
	}
	
	validate(connection) {
		
	}
	
	removeConnection(connection) {
		GameEditor.getJsPlumbInstance().deleteConnection(GameEditor.getJsPlumbInstance().getConnections({source:connection.connectionFrom.htmlId,target:connection.connectionTo.htmlId})[0]);
		connection.detach();
	}
}