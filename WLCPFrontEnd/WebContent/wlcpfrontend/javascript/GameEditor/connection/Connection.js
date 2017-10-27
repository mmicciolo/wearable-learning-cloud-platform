/**
 * 
 */

class Connection {
	constructor(connectionFrom, connectionTo, gameConnectionId) {
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
		this.gameConnectionId = gameConnectionId;
	}
	
	static load() {
		var filters = [];
		filters.push(new sap.ui.model.Filter({path: "Game", operator: sap.ui.model.FilterOperator.EQ, value1: GameEditor.getEditorController().gameModel.GameId}));
		ODataModel.getODataModel().read("/Connections", {filters: filters, success: $.proxy(this.loadSuccess, this), error: this.saveError});
	}
	
	static loadSuccess(oData) {
		for(var i = 0; i < oData.results.length; i++) {
			if(oData.results[i].ConnectionFrom == "start") {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : oData.results[i].ConnectionFrom}).get(0);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : oData.results[i].ConnectionTo}).get(0);
				GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
			} else {
				var ep1 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : oData.results[i].ConnectionFrom}).get(1);
				var ep2 = GameEditor.getEditorController().jsPlumbInstance.selectEndpoints({element : oData.results[i].ConnectionTo}).get(0);
				GameEditor.getEditorController().jsPlumbInstance.connect({source: ep1 , target: ep2});
			}
		}
		GameEditor.getEditorController().busy.close();
		sap.m.MessageToast.show("Game Loaded Successfully!");
	}
	
	save() {
		var filters = [];
		filters.push(new sap.ui.model.Filter({path: "Game", operator: sap.ui.model.FilterOperator.EQ, value1: GameEditor.getEditorController().gameModel.GameId}));
		filters.push(new sap.ui.model.Filter({path: "GameConnectionId", operator: sap.ui.model.FilterOperator.EQ, value1: this.gameConnectionId}));
		
		//Read in the state data
		ODataModel.getODataModel().read("/Connections", {filters: filters, success: $.proxy(this.saveConnection, this), error: this.saveError});
	}
	
	saveConnection(oData) {
		var saveData = {
			ConnectionId : 0,
			GameConnectionId : this.gameConnectionId,
			ConnectionFrom : this.connectionFrom,
			ConnectionTo : this.connectionTo,
			GameDetails : {
				__metadata : {
		             uri : ODataModel.getODataModelURL() + "/Games('" + GameEditor.getEditorController().gameModel.GameId + "')"
		         }
			}
		}
		
		if(oData.results.length == 1) {
			
			//We need to update the entry
			ODataModel.getODataModel().update("/Connections(" + oData.results[0].ConnectionId + ")", saveData, {success: this.saveSuccess, error: this.saveError});
				
		} else if(oData.results.length == 0) {
			
			//We need to create the entry
			ODataModel.getODataModel().create("/Connections", saveData, {success: this.saveSuccess, error: this.saveError});

		} else {
			//Something went terribly wrong...
		}
	}
	
	saveSuccess() {
		GameEditor.getEditorController().saveFSM();
	}
	
	saveError() {
		
	}
}