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
		
		var loopBack = this.isLoopBack(state2.htmlId, state.htmlId);
		var neighborloopBack = false;
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({target : validationData.connectionTo});
		for(var i = 0; i < neighborConnections.length; i++) {
			if(neighborConnections[i].id != validationData.connectionId) {
				var neighbors = GameEditor.getJsPlumbInstance().getConnections({source : neighborConnections[i].sourceId});
				for(var n = 0; n < neighbors.length; n++) {
					if(neighbors[n].targetId != validationData.connectionTo) {
						if(this.isLoopBack(validationData.connectionTo, neighbors[n].targetId)) {
							neighborloopBack = true;
							break;
						}
					}
				}
			}
		}
		
		if(loopBack && !neighborloopBack) {
			validationData.isLoopBack = true;
		} else if(neighborloopBack) {
			sap.m.MessageBox.error("You cannot loop back to a neighbor.");
			this.removeConnection(validationData);
			return;
		}
		
		//Store the connection in the states
		state.inputConnections.push(validationData);
		state2.outputConnections.push(validationData);
		
		//Store the input and output state in the connection
		validationData.connectionTo = state;
		validationData.connectionFrom = state2;

		//Tell the state to update
		this.getState(validationData.connectionTo.htmlId).onChange();
		
		//Log it
		DataLogger.logGameEditor();
	}
	
	getState(stateId) {
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(GameEditor.getEditorController().stateList[i].htmlId == stateId) {
				return GameEditor.getEditorController().stateList[i];
			}
		}
	}

	isLoopBack(stateId, nextState, calledArgs = []) {
		var connections = GameEditor.getJsPlumbInstance().getConnections({source : nextState});
		for(var i = 0; i < connections.length; i++) {
			if(connections[i].targetId == stateId) {
				return true;
			} else {
				if(!calledArgs.includes(stateId + connections[i].targetId)) {
					calledArgs.push(stateId + connections[i].targetId);
					var result = this.isLoopBack(stateId, connections[i].targetId, calledArgs);
					if(result) {
						return result;
					}
				}
			}
		}
		return false;
	}
}