/**
 * 
 */

var OutputState = class OutputState extends State {
	
	constructor(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance) {
		super(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance);
		this.modelJSON = {
				description : this.text,
				iconTabs : []
		}
		this.oldModelJSON = {};
		this.stateConfigs = [];
		this.setupStateConfigs();
		this.modelJSON.iconTabs = this.generateData(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		this.create();
		this.validationRules = [];
		this.setupValidationRules();
		this.scopeMask = 0xffffffff;
	}
	
	create() {
		
		//Call the super method
		super.create();
		
		//Define the input end point style
		this.inputEndPoint = {
				 endpoint:"Dot",
				 isTarget:true,
				 isSource:false,
				 maxConnections: -1
		};
		
		//Define the output end point style
		this.outputEndPoint = {
				 endpoint:"Dot",
				 isTarget:false,
				 isSource:true,
				 maxConnections: -1,
		};
		
		//Setup the end points
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "input", anchor:"Top", paintStyle:{ fill: "#5E696E" } }, this.inputEndPoint);
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "output", anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
		
		//Setup double click
		$("#"+this.stateDiv.id).dblclick($.proxy(this.doubleClick, this));
	}
	
	setupStateConfigs() {
		this.stateConfigs.push(new StateConfigDisplayText(this));
	}
	
	setupValidationRules() {
		this.validationRules.push(new StateScopeValidationRule());
	}
	
	doubleClick() {
		
		//Check to see if we have a connection to us
		var hasConnection = false;
		for(var i = 0; i < GameEditor.getEditorController().connectionList.length; i++) {
			if(GameEditor.getEditorController().connectionList[i].connectionTo.htmlId == this.htmlId) {
				hasConnection = true;
				break;
			}
		}
		if(!hasConnection) {
			sap.m.MessageBox.error("Drop a connection of the state before using it!");
			return;
		}
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.States.OutputStateConfig", this);
		
		//Set the model for the dialog
		this.dialog.setModel(this.model);

		//Setup the state config pages + models
		var iconTabBar = sap.ui.getCore().byId("outputStateDialogIconTabBar").getItems();
		for(var i = 0; i < iconTabBar.length; i++) {
			for(var n = 0; n < iconTabBar[i].getContent()[0].getContentAreas()[1].getPages().length; n++) {
				var iconTabBarPage = iconTabBar[i].getContent()[0].getContentAreas()[1].getPages()[n];
				if(iconTabBarPage.getContent().length == 0) {
					this.stateConfigs[n].getStateConfigFragment().forEach(function (oElement) {iconTabBarPage.addContent(oElement);});
				}
				iconTabBarPage.setTitle(iconTabBar[i].getProperty("text") + " " + this.stateConfigs[n].getNavigationContainerPage().title);
			}
		}
			
		this.dialog.getContent()[0].addEventDelegate({
			onAfterRendering : $.proxy(this.tabRendered, this)
		});
		
		//Set the old scope mask
		this.oldModelJSON = JSON.parse(JSON.stringify(this.modelJSON));
		
		//Open the dialog
		this.dialog.open();
	}

	//This is supposed to focus on the text box, but it no longer works and has been commented
	tabRendered() {
//		for(var i = 0; i < this.dialog.getContent()[0].getItems().length; i++) {
//			if(this.dialog.getContent()[0].getItems()[i].getKey() == this.dialog.getContent()[0].getSelectedKey()) {
//				var info = this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].getFocusInfo();
//				info.selectionStart = this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].getValue().length;
//				info.selectionEnd = this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].getValue().length;
//				this.dialog.getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getCurrentPage().getContent()[1].getItems()[0].applyFocusInfo(info);
//				break;
//			}
//		}
	}
	
	descriptionChanged(oEvent) {
		this.changeText(oEvent.getParameter("newValue"));
	}
	
	createData() {
		var tempNavigationListItems = [];
		var tempNavigationContainerPages = [];
		for(var i = 0; i < this.stateConfigs.length; i++) {
			tempNavigationListItems.push(this.stateConfigs[i].getNavigationListItem());
			tempNavigationContainerPages.push(this.stateConfigs[i].getNavigationContainerPage());
		}
		return {
			icon : "",
			scope : "",
			navigationListItems : tempNavigationListItems,
			navigationContainerPages : tempNavigationContainerPages,
		}
	}
	
	generateData(teams, playersPerTeam) {
		
		//Create a new object to store the data
		var baseData = [];

		//Add game wide
		var data = this.createData();
		data.icon = "sap-icon://globe";
		data.scope = "Game Wide";
		for(var i = 0; i < data.navigationContainerPages.length; i++) {
			data.navigationContainerPages[i].scope = data.scope;
		}
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
		this.onChange();
	}
	
	setScope(bitMask, teamCount, playersPerTeam) {
		
		this.scopeMask = bitMask;
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
					data.icon = "sap-icon://group";
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
						data.icon = "sap-icon://employee";
						data.scope = "Team " + (i + 1) + " Player " + (n + 1);
						newTabs.push(data);
					}
				}
				mask = mask >> 1;
			}
		}
		
		this.modelJSON.iconTabs = newTabs;
		this.model.setData(this.modelJSON);
		
		if(typeof sap.ui.getCore().byId("outputStateDialogIconTabBar") !== "undefined") {
			var iconTabBar = sap.ui.getCore().byId("outputStateDialogIconTabBar").getItems();
			for(var i = 0; i < iconTabBar.length; i++) {
				for(var n = 0; n < iconTabBar[i].getContent()[0].getContentAreas()[1].getPages().length; n++) {
					var iconTabBarPage = iconTabBar[i].getContent()[0].getContentAreas()[1].getPages()[n];
					if(iconTabBarPage.getContent().length == 0) {
						this.stateConfigs[n].getStateConfigFragment().forEach(function (oElement) {iconTabBarPage.addContent(oElement);});
					}
					iconTabBarPage.setTitle(iconTabBar[i].getProperty("text") + " " + this.stateConfigs[n].getNavigationContainerPage().title);
				}
			}
		}
	}
	
    onChange(oEvent) {
    	for(var i = 0; i < this.validationRules.length; i++) {
    		this.validationRules[i].validate(this);
    	}
    }
    
    revalidate() {
    	for(var i = 0; i < this.validationRules.length; i++) {
    		this.validationRules[i].validate(this, true, true);
    	}
    }
    
    acceptDialog() {
		this.validationRules[0].validate(this, true, true);
		this.dialog.close();
		this.dialog.destroy();
		DataLogger.logGameEditor();
    }
	
	closeDialog() {
		this.modelJSON = JSON.parse(JSON.stringify(this.oldModelJSON));
		this.model.setData(this.modelJSON);
		this.dialog.close();
		this.dialog.destroy();
		DataLogger.logGameEditor();
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
		var outputState = new OutputState("toolboxOutputStateTopColor", "toolboxOutputStateBottomColor", loadData.description, loadData.stateId, GameEditor.getEditorController().jsPlumbInstance);
		
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
		for(var i = 0; i < this.stateConfigs.length; i++) {
			this.stateConfigs[i].setLoadData(loadData, this.modelJSON.iconTabs);
		}
	}
	
	save() {
		var tempInputConnections = [];
		for(var i = 0; i < this.inputConnections.length; i++) {
			tempInputConnections.push({
				connectionId : this.inputConnections[i].connectionId
			});
		}
		
		var tempOutputConnections = [];
		for(var i = 0; i < this.outputConnections.length; i++) {
			tempOutputConnections.push({
				connectionId : this.outputConnections[i].connectionId
			});
		}
		
		var saveData = {
			stateId : this.htmlId,
			positionX : this.positionX,
			positionY : this.positionY,
			stateType : "OUTPUT_STATE",
			description : this.text,
			inputConnections : tempInputConnections,
			outputConnections : tempOutputConnections//,
		}
		
		for(var i = 0; i < this.stateConfigs.length; i++) {
			var data = this.stateConfigs[i].getSaveData();
			for(var key in data) {
				saveData[key] = data[key];
			}
		}
		
		return saveData;
	}
	
	getActiveScopes() {
		var activeScopes = [];
		for(var i = 0; i < this.stateConfigs.length; i++) {
			var tempActiveScopes = this.stateConfigs[i].getActiveScopes();
			for(var n = 0; n < tempActiveScopes.length; n++) {
				if(activeScopes.indexOf(tempActiveScopes[n]) == -1) {
					activeScopes.push(tempActiveScopes[n]);
				}
			}
		}
		return activeScopes;
	}
}