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

var ConnectionValidationSuccess = class ConnectionValidationSuccess extends ValidationRule {
	
	validate(validationData) {
		
		//Make the connection
		if(validationData.connectionFrom == (GameEditor.getEditorController().gameModel.GameId + "_start")) {
			var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionFrom}).get(0);
			var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionTo}).get(0);
			var connection = GameEditor.getEditorController().jsPlumbInstance.connect({ source: ep1 , target: ep2});
			connection.id = validationData.connectionId;
		} else {
			var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionFrom}).get(1);
			var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : validationData.connectionTo}).get(0);
			var connection = GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
			connection.id = validationData.connectionId;
		}
		
		var state = this.getState(validationData.connectionTo);
		var state2 = this.getState(validationData.connectionFrom);

		var loopBack = this.isLoopBack3(state2.htmlId, state.htmlId);
		if(loopBack) {
			validationData.isLoopBack = true;
		}

		//Tell the state to update
		this.getState(validationData.connectionTo).onChange();	
	}
	
	getState(stateId) {
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(GameEditor.getEditorController().stateList[i].htmlId == stateId) {
				return GameEditor.getEditorController().stateList[i];
			}
		}
	}
	
	isLoopBack4(stateId, nextState, calledArgs = []) {
		var connections = GameEditor.getJsPlumbInstance().getConnections({source : nextState});
	}
	
	isLoopBack3(stateId, nextState, calledArgs = []) {
		var connections = GameEditor.getJsPlumbInstance().getConnections({source : nextState});
		for(var i = 0; i < connections.length; i++) {
			if(connections[i].targetId == stateId) {
				return true;
			} else {
				if(!calledArgs.includes(stateId + nextState)) {
					calledArgs.push(stateId + nextState);
					var result = this.isLoopBack3(stateId, connections[i].targetId, calledArgs);
					if(result) {
						return result;
					}
				}
			}
		}
		return false;
	}
}