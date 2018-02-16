/**
 * 
 */

var Connection = class Connection {
	constructor(connectionFrom, connectionTo, connectionId) {
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
		this.connectionId = connectionId;
		this.isLoopBack = false;
		this.validationCounter = -1;
		this.validationRules = [];
		this.setupValidationRules();
	}
	
	static load(loadData) {
		for(var i = 0; i < loadData.length; i++) {
			//var state = this.getState(loadData[i].connectionTo);
			//var state2 = this.getState(loadData[i].connectionFrom);
			//var loopBack = this.isLoopBack(state2.htmlId, state.htmlId);
			var editorConnection = new Connection(loadData[i].connectionFrom, loadData[i].connectionTo, loadData[i].connectionId);
			GameEditor.getEditorController().connectionList.push(editorConnection);
			if(loadData[i].connectionFrom == (GameEditor.getEditorController().gameModel.GameId + "_start")) {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionFrom}).get(0);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionTo}).get(0);
				var connection = GameEditor.getEditorController().jsPlumbInstance.connect({ source: ep1 , target: ep2});
				connection.id = loadData[i].connectionId;
			} else {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionFrom}).get(1);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionTo}).get(0);
				var connection = GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
				connection.id = loadData[i].connectionId;
			}
		}
		
		//editorConnection.isLoopBack = loopBack;
		
		for(var i = 0; i < GameEditor.getEditorController().connectionList.length; i++) {
			var state = this.getState(GameEditor.getEditorController().connectionList[i].connectionTo);
			var state2 = this.getState(GameEditor.getEditorController().connectionList[i].connectionFrom);

			var loopBack = this.isLoopBack(state2.htmlId, state.htmlId);
			if(loopBack) {
				GameEditor.getEditorController().connectionList[i].isLoopBack = true;
			}
		}
	}
	
	static getState(stateId) {
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(GameEditor.getEditorController().stateList[i].htmlId == stateId) {
				return GameEditor.getEditorController().stateList[i];
			}
		}
	}
	
	static isLoopBack(stateId, nextState, calledArgs = []) {
		var connections = GameEditor.getJsPlumbInstance().getConnections({source : nextState});
		for(var i = 0; i < connections.length; i++) {
			if(connections[i].targetId == stateId) {
				return true;
			} else {
				if(!calledArgs.includes(stateId + nextState)) {
					calledArgs.push(stateId + nextState);
					var result = this.isLoopBack(stateId, connections[i].targetId, calledArgs);
					if(result) {
						return result;
					}
				}
			}
		}
		return false;
	}
	
	validate() {
		if(this.validationCounter != this.validationRules.length - 1) {
			this.validationCounter++;
			this.validationRules[this.validationCounter].validate(this);
		} else {
			this.validationCounter = -1;
		}
	}
	
	setupValidationRules() {
		this.validationRules.push(new ConnectionValidationSuccess());
		//this.validationRules.push(new ConnectionGameWideValidationRule());
		//this.validationRules.push(new ConnectionDroppedOnHigherScope());
		//this.validationRules.push(new ConnectionScopeCountValidationRule());
	}

	detach() {
		
		//Loop through all of the transitions
		for(var i = 0; i < GameEditor.getEditorController().transitionList.length; i++) {
			
			//If we found the transition on this connection remove it
			if(GameEditor.getEditorController().transitionList[i].connection.id == this.connectionId) {
				
				//Remove it
				GameEditor.getEditorController().transitionList[i].removeTransition(sap.m.MessageBox.Action.OK);
				break;
			}
		}
		
		//Remove ourself from the connection list
		GameEditor.getEditorController().connectionList.splice(GameEditor.getEditorController().connectionList.indexOf(this), 1);
	}
	
	save() {
		var saveData = {
			connectionId : this.connectionId,
			connectionFrom : this.connectionFrom,
			connectionTo : this.connectionTo,
		}
		return saveData;
	}
}