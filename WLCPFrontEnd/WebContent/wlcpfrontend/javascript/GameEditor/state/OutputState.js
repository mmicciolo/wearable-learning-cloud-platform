/**
 * 
 */

var OutputState = class OutputState extends State {
	
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
		this.modelJSON.iconTabs = this.generateData(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		this.create();
		this.validationRules = [];
		this.setupValidationRules();
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
	
	setupValidationRules() {
		this.validationRules.push(new StateScopeValidationRule());
	}
	
	doubleClick() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.States.OutputStateConfig", this);
		
		//Set the model for the dialog
		this.dialog.setModel(this.model);
			
		this.dialog.getContent()[0].addEventDelegate({
			onAfterRendering : $.proxy(this.tabRendered, this)
		});
		
		//Open the dialog
		this.dialog.open();
	}

	tabRendered() {
		if(this.focus != null) {
			for(var i = 0; i < this.dialog.getContent()[0].getItems().length; i++) {
				if(this.dialog.getContent()[0].getItems()[i].getKey() == this.dialog.getContent()[0].getSelectedKey()) {
					var info = this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].getFocusInfo();
					info.selectionStart = this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].getValue().length;
					info.selectionEnd = this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].getValue().length;
					this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].applyFocusInfo(info);
					this.focus = null;
					break;
				}
			}
		}
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
	
	validate() {
		console.log("validating...");
	}
	
	setScope(bitMask, teamCount, playersPerTeam) {
		
		var mask = bitMask;
		var model = this.modelJSON.iconTabs;
		var newTabs = [];
	
		//Test gamewide
		if(bitMask & 0x01) {
			var exists = false;
			for(var i = 0; i < model.length; i++) {
				if(model[i].scope == "Game Wide") {
					exists = true;
					newTabs.push(model[i]);
					break;
				}
			}
			if(!exists) {
				var data = this.createData();
				data.icon = "sap-icon://globe";
				data.scope = "Game Wide";
				newTabs.push(data);
			}
		}
		
		mask = mask >> 1;
		
		for(var i = 0; i < teamCount; i++) {
			if(mask & 0x01) {
				var exists = false;
				for(var n = 0; n < model.length; n++) {
					if(model[n].scope == "Team " + (i + 1)) {
						exists = true;
						newTabs.push(model[n]);
						break;
					}
				}
				if(!exists) {
					var data = this.createData();
					data.icon = "sap-icon://globe";
					data.scope = "Team " + (i + 1);
					newTabs.push(data);
				}
			}	
			mask = mask >> 1;
		}	
		
		for(var i = 0; i < teamCount; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				if(mask & 0x01) {
					var exists = false;
					for(var j = 0; j < model.length; j++) {
						if(model[j].scope == "Team " + (i + 1) + " Player " + (n + 1)) {
							exists = true;
							newTabs.push(model[j]);
							break;
						}
					}
					if(!exists) {
						var data = this.createData();
						data.icon = "sap-icon://globe";
						data.scope = "Team " + (i + 1) + " Player " + (n + 1);
						newTabs.push(data);
					}
				}
				mask = mask >> 1;
			}
		}
		
		this.modelJSON.iconTabs = newTabs;
		this.model.setData(this.modelJSON);
	}
	
    onChange(oEvent) {
    	for(var i = 0; i < this.validationRules.length; i++) {
    		this.validationRules[i].validate(this);
    	}
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
	
	static load(loadData) {
		//Create a new display state
		var outputState = new OutputState("toolboxOutputStateTopColor", "toolboxOutputStateBottomColor", "Output State", loadData.stateId, GameEditor.getEditorController().jsPlumbInstance);
		
		//Set the position
		outputState.setPositionX(loadData.positionX); outputState.setPositionY(loadData.positionY);
		
		//Redraw it
		outputState.draw();
		
		//Push back the state
		GameEditor.getEditorController().stateList.push(outputState);
		
		//Load the states components
		outputState.loadComponents(loadData);
	}
	
	loadComponents(loadData) {
		for(var key in loadData.displayText) {
			for(var n = 0; n < this.modelJSON.iconTabs.length; n++) {
				if(key == this.modelJSON.iconTabs[n].scope) {
					this.modelJSON.iconTabs[n].displayText = loadData.displayText[key];
				}
			}
		}
	}
	
	save() {
		var outputStateData = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			if(this.modelJSON.iconTabs[i].displayText != "") {
				outputStateData[this.modelJSON.iconTabs[i].scope] = this.modelJSON.iconTabs[i].displayText;
			}
		}
		
		var saveData = {
			stateId : this.htmlId,
			positionX : this.positionX,
			positionY : this.positionY,
			stateType : "OUTPUT_STATE",
			displayText : outputStateData
		}
		
		return saveData;
	}
}