/**
 * 
 */

class OutputState extends State {
	
	constructor(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance) {
		super(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance);
		this.inputEndPoint = {
				 endpoint:"Dot",
				 isTarget:true,
				 isSource:false,
				 maxConnections: -1
			};
		this.outputEndPoint = {
				 endpoint:"Dot",
				 isTarget:false,
				 isSource:true,
				 maxConnections: -1,
			};
		this.modelJSON = {
				iconTabs : []
		}
		this.create();
		this.model = null;
	}
	
	create() {
		
		//Call the super method
		super.create();
		
		//Setup the end points
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "input", anchor:"Top", paintStyle:{ fill: "#5E696E" } }, this.inputEndPoint);
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "output", anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
		
		//Setup double click
		$("#"+this.stateDiv.id).dblclick($.proxy(this.doubleClick, this));
	}
	
	doubleClick() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.test2", this);
		
		this.modelJSON.iconTabs = this.generateData(3,3);
		
		if(this.model == null) {
			this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		}
		
		this.dialog.setModel(this.model);
			
		//Open the dialog
		this.dialog.open();
		
//		for(var i = 0; i < this.modelJSON.displayTextData.length; i++) {
//			sap.ui.getCore().byId("displayTextTable").getRows()[i].getCells()[0].setSelectedKeys(this.modelJSON.displayTextData[i].row.selected);
//		}
	}
	
	createData() {
		return {
			icon : "",
			scope : ""
		}
	}
	
	generateData(teams, playersPerTeam) {
		
		//Create a new object to store the data
		var baseData = [];

		//Add game wide
		var data = this.createData();
		data.icon = "sap-icon://globe";
		data.scope = "Game Wide";
		baseData.push(data);
		
		//Add the teams
		for(var i = 0; i < teams; i++) {
			data = this.createData();
			data.icon = "sap-icon://group";
			data.scope = "Team " + (i + 1);
			baseData.push(data);
		}
		
		//Add the players
		for(var i = 0; i < teams; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				data = this.createData();
				data.icon = "sap-icon://employee";
				data.scope = "Team " + (i + 1) + " Player " + (n + 1);
				baseData.push(data);
			}
		}
		
		return baseData;
	}

	addTextRow() {
//		//We need a connection to a parent
//		if(true) {}
//		
//		//Get the already selected items
//		var alreadySelected = this.getSurroundingSelections();
//		
//		//Only make the following checks if there is data in the model
//		if(this.model.data.length > 0) {
//			//You cannot add a row if you have not selected anything in the current row
//			if(sap.ui.getCore().byId("displayTextTable").getRows()[this.model.data.length - 1].getCells()[0].getSelectedKeys().length == 0) {
//				return;
//			}
//			//You cannot add a row if game wide is selected
//			else if(alreadySelected.indexOf("Game Wide") != -1) { 
//				return;
//			}
//		}
		
		//Generate possible selections based off of this
		var baseData = this.generateData(3, 3);
		
		//Update the model
		this.modelJSON.displayTextData.push(baseData);
		this.model.setData(this.modelJSON);
	}
	
	handleSelectionChange(oEvent) {
		var changedItem = oEvent.getParameter("changedItem");
		var isSelected = oEvent.getParameter("selected");
		
		if(isSelected) {
			this.modelJSON.displayTextData[oEvent.oSource.getParent().getIndex()].row.selected.push(changedItem.getKey());
		} else {
			this.modelJSON.displayTextData[oEvent.oSource.getParent().getIndex()].row.selected.splice(this.modelJSON.displayTextData[oEvent.oSource.getParent().getIndex()].row.selected.indexOf(changedItem.getKey()), 1);
		}
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
	
	navigationSelected(oEvent) {
		var key = oEvent.getParameter("item").getKey();
		var navContainer = sap.ui.getCore().byId("outputStateNavContainer");
		var nextPage = sap.ui.getCore().byId(key);
		navContainer.to(nextPage);
	}
	
	static loadData(oData) {
		//Create a new display state
		var outputState = new OutputState("toolboxOutputStateTopColor", "toolboxOutputStateBottomColor", "Output State", oData.GameStateId, GameEditor.getEditorController().jsPlumbInstance);
		
		//Set the position
		outputState.setPositionX(oData.PositionX); outputState.setPositionY(oData.PositionY);
		
		//Redraw it
		outputState.draw();
		
		//Push back the state
		GameEditor.getEditorController().stateList.push(outputState);
	}
	
	save() {
		super.save("/OutputStates", this.saveState, this);
	}

	saveState(oData) {
		
		var saveData = {
			StateId : 0,
			GameStateId : this.htmlId,
			PositionX : this.positionX,
			PositionY : this.positionY,
			GameDetails : {
				__metadata : {
		             uri : ODataModel.getODataModelURL() + "/Games('" + GameEditor.getEditorController().gameModel.GameId + "')"
		         }
			},
		}
		
		super.saveState(oData, "/OutputStates", saveData);
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
}