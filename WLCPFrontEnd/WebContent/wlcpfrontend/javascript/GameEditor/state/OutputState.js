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
		this.modelJSON.iconTabs = this.generateData(3,3);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		this.create();
		this.displayTextCreated = [];
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
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.States.OutputStateConfig", this);
		
		//Set the model for the dialog
		this.dialog.setModel(this.model);
			
		//Open the dialog
		this.dialog.open();
	}
	
	createData() {
		return {
			icon : "",
			scope : "",
			displayText : ""
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
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
	
	navigationSelected(oEvent) {
		var key = oEvent.getParameter("item").getKey();
		var navContainer = oEvent.oSource.getParent().getParent().getContentAreas()[1];
		for(var i = 0; i < navContainer.getPages().length; i++) {
			if(navContainer.getPages()[i].getTitle().includes(key)) {
				navContainer.to(navContainer.getPages()[i]);
				break;
			}
		}
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
		
		//Load its components
		//outputState.loadComponents(oData);
	}
	
	loadComponents(oData) {
		this.loadDisplayText(oData);
	}
	
	loadDisplayText(oData) {
		ODataModel.getODataModel().read("/OutputStates" + "(" + oData.StateId + ")/DisplayTextStateMapDetails", {success : $.proxy(this.loadDisplayTextSuccess, this, oData), error : super.saveError});
	}
	
	loadDisplayTextSuccess(origOData, oData) {
		for(var i = 0; i < oData.results.length; i++) {
			for(var n = 0; n < this.modelJSON.iconTabs.length; n++) {
				if(oData.results[i].Scope == this.modelJSON.iconTabs[n].scope) {
					this.modelJSON.iconTabs[n].displayText = oData.results[i].DisplayText;
				}
			}
		}
	}
	
	saveFSM() {
		this.saveCount++;
		switch(this.type) {
		case "DISPLAY_TEXT":
			if(this.modelJSON.iconTabs.length != this.saveCount) {
				if(this.modelJSON.iconTabs[this.saveCount].displayText != "") {
					this.saveDisplayText();
				} else {
					this.saveFSM();
				}
			} else {
				this.saveCount = -1;
				this.type = "NULL";
				this.displayTextCreated = [];
				this.saveFSM();
			}
			break;
		}
	}
	
	saveDisplayText() {
		
		var filters = [];
		filters.push(new sap.ui.model.Filter({path: "Game", operator: sap.ui.model.FilterOperator.EQ, value1: GameEditor.getEditorController().gameModel.GameId}));
		filters.push(new sap.ui.model.Filter({path: "GameStateId", operator: sap.ui.model.FilterOperator.EQ, value1: this.htmlId}));
		filters.push(new sap.ui.model.Filter({path: "Scope", operator: sap.ui.model.FilterOperator.EQ, value1: this.modelJSON.iconTabs[this.saveCount].scope}));
		
		//Read in the state data
		ODataModel.getODataModel().read("/DisplayTextStateMaps", {filters: filters, success: $.proxy(this.saveDisplayTextSuccess, this), error: super.saveError});
	}
	
	saveDisplayTextSuccess(oData) {
		if(oData.results.length == 1) {
			
			//We need to update the entry
			ODataModel.getODataModel().update("/DisplayTextStateMaps" + "(" + oData.results[0].DisplayTextStateMapId + ")", {DisplayText : this.modelJSON.iconTabs[this.saveCount].displayText}, {success: $.proxy(this.saveFSM, this), error: super.saveError});
				
		} else if(oData.results.length == 0) {
			
			var saveData = {
				DisplayTextStateMapId : 0, 
				GameStateId : this.htmlId, 
				GameDetails : {
					__metadata : {
			             uri : ODataModel.getODataModelURL() + "/Games('" + GameEditor.getEditorController().gameModel.GameId + "')"
					}
				},
				DisplayText : this.modelJSON.iconTabs[this.saveCount].displayText, 
				Scope : this.modelJSON.iconTabs[this.saveCount].scope
			}
			
			//We need to create the entry
			ODataModel.getODataModel().create("/DisplayTextStateMaps", saveData, {success: $.proxy(this.createDisplayTextSuccess, this), error: super.saveError});

		} else {
			//Something went terribly wrong...
		}
	}
	
	createDisplayTextSuccess(oData, response) {
		var filters = [];
		filters.push(new sap.ui.model.Filter({path: "Game", operator: sap.ui.model.FilterOperator.EQ, value1: oData.Game}));
		filters.push(new sap.ui.model.Filter({path: "GameStateId", operator: sap.ui.model.FilterOperator.EQ, value1: oData.GameStateId}));
		filters.push(new sap.ui.model.Filter({path: "Scope", operator: sap.ui.model.FilterOperator.EQ, value1: oData.Scope}));
		
		//Read in the state data
		ODataModel.getODataModel().read("/DisplayTextStateMaps", {filters: filters, success: $.proxy(this.saveCreatedDisplayText, this), error: super.saveError});
	}
	
	saveCreatedDisplayText(oData) {
		this.displayTextCreated.push(oData.results[0].DisplayTextStateMapId);
		this.saveFSM();
	}
	
	save() {
		this.saveCount = -1;
		this.type = "DISPLAY_TEXT";
		this.saveFSM();
		super.save("/OutputStates", this.saveState, this);
	}

	saveState(oData) {
		
		var displayText = [];
		
		for(var i = 0; i < this.displayTextCreated.length; i++) {
			displayText.push({__metadata : {
		             uri : ODataModel.getODataModelURL() + "/DisplayTextStateMaps(" + this.displayTextCreated[i] + ")"
		         }});
		}
		
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
			DisplayTextStateMapDetails : displayText
		}
		
		super.saveState(oData, super.saveSuccess, "/OutputStates", saveData);
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
}