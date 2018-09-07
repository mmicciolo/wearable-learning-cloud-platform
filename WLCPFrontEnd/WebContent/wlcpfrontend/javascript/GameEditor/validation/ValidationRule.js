var ValidationRule = class ValidationRule {
	
	constructor() {
		
	}
	
	validate(connection) {
		
	}
	
	removeConnection(connection) {
		GameEditor.getJsPlumbInstance().deleteConnection(GameEditor.getJsPlumbInstance().getConnections({source:connection.connectionFrom,target:connection.connectionTo})[0]);
		connection.detach();
	}
}