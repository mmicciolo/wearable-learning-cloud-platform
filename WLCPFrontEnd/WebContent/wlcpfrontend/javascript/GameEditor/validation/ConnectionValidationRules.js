/**
 * Check if there are any connections coming from the source state that go to a target state that has game wide output. 
 * If so don't allow the connection
 */
var ConnectionGameWideValidationRule = class ConnectionGameWideValidationRule extends ValidationRule {
	
	validate(connection) {
		var previousStateConnections = GameEditor.getJsPlumbInstance().getConnections({source : connection.connectionFrom});
		if(previousStateConnections.length == 1) {
			sap.m.MessageBox.error("That source is already connected to a state that contains Game Wide Scope.", {title: "Connection could not be made", onClose : $.proxy(this.onClose, this)});
			this.connection = connection;
		} else {
			connection.validate();
		}
//		if(previousStateConnections.length == 0) {
//			return true;
//		} else if(previousStateConnections.length == 1){
//			if(this.getState(previousStateConnections[0].targetId).getActiveScopes().includes("Game Wide")) {
//				sap.m.MessageBox.error("That source is already connected to a state that contains Game Wide Scope.", {title: "Connection could not be made"});
//				return false;
//			} else {
//				return true;
//			}
//		} else {
//			return true;
//		}
	}
	
	onClose(oAction) {
		this.removeConnection(this.connection);
	}
	
	getState(stateId) {
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(GameEditor.getEditorController().stateList[i].htmlId == stateId) {
				return GameEditor.getEditorController().stateList[i];
			}
		}
	}
}

var ConnectionDroppedOnHigherScope = class ConnectionDroppedOnHigherScope extends ValidationRule {
	
	validate(connection) {
		var previousStateConnections = GameEditor.getJsPlumbInstance().getConnections({source : connection.connectionFrom});
		var targetState = this.getState(connection.connectionTo);
		this.statesToRemove = [];
		this.connection = connection;
		for(var i = 0; i < targetState.getActiveScopes().length; i++) {
			for(var n = 0; n < previousStateConnections.length; n++) {
				var state = this.getState(previousStateConnections[n].targetId);
				if(this.checkForHigherScope(targetState.getActiveScopes()[i], state.getActiveScopes())) {
					this.statesToRemove.push(state);
				}
			}
		}
		if(this.statesToRemove.length > 0) {
			sap.m.MessageBox.confirm("You are dropping a connection on a state with a higher scope. If you confirm this connection will be made and the others severed", {title: "Sever Connection?", onClose : $.proxy(this.onClose, this)});
		}
	}
	
	onClose(oAction) {
		if(oAction == sap.m.MessageBox.Action.OK) {
			
		} else {
			this.removeConnection(this.connection);
		}
	}
	
	checkForHigherScope(scope, scopeList) {
		for(var i = 0; i < scopeList.length; i++) {
			if((scope == "Game Wide" && !scopeList.includes("Game Wide")) || (scope != scopeList[i] && scopeList[i].includes(scope))) {
				return true;
			}
		}
		return false;
	}
	
	getState(stateId) {
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(GameEditor.getEditorController().stateList[i].htmlId == stateId) {
				return GameEditor.getEditorController().stateList[i];
			}
		}
	}
}

/**
 * If a user has source connection(s) going from one state to another and they drag
 * a connection from that source to a state that contains a game wide scope we need
 * to ask them if they want this game wide scope to override the other states
 */
var ConnectionDroppedOnGameWideState = class ConnectionDroppedOnGameWideState extends ValidationRule {
	
	validate(validationData) {
		var previousStateConnections = GameEditor.getJsPlumbInstance().getConnections({source : validationData.sourceId});
		for(var i = 0; i < previousStateConnections.length; i++) {
			
		}
	}
}

var ConnectionScopeCountValidationRule = class ConnectionScopeCountValidationRule extends ValidationRule {
	
	validate(validationData) {
		return true;
	}
}