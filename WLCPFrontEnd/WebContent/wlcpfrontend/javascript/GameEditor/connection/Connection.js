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
			var editorConnection = new Connection(loadData[i].connectionFrom, loadData[i].connectionTo, loadData[i].connectionId);
			editorConnection.isLoopBack = loadData[i].backwardsLoop;
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
			backwardsLoop : this.isLoopBack
		}
		return saveData;
	}
}