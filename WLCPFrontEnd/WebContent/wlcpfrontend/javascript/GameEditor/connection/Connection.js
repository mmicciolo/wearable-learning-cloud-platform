/**
 * 
 */

class Connection {
	constructor(connectionFrom, connectionTo, gameConnectionId) {
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
		this.gameConnectionId = gameConnectionId;
	}
	
	static load(loadData) {
		for(var i = 0; i < loadData.length; i++) {
			if(loadData[i].connectionFrom == (GameEditor.getEditorController().gameModel.GameId + "_start")) {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionFrom}).get(0);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionTo}).get(0);
				GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
			} else {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionFrom}).get(1);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : loadData[i].connectionTo}).get(0);
				GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
			}
		}
	}
	
	save() {
		var saveData = {
			gameConnectionId : this.gameConnectionId,
			connectionFrom : this.connectionFrom,
			connectionTo : this.connectionTo,
			//gameDetails : GameEditor.getEditorController().gameModel.GameId
		}
		return saveData;
	}
}