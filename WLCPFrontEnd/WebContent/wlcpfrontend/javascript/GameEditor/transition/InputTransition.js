/**
 * 
 */

var InputTransition = class InputTransition extends Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		super(cssClass, connection, overlayId, gameEditor);
		this.create();
		this.modelJSON = {
				iconTabs : []
		}
		this.modelJSON.iconTabs = this.generateData(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		this.validationRules = [];
		this.setupValidationRules();
	}
	
	create() {
		
		//Add the overlay
		this.connection.addOverlay([ "Label", {id : this.overlayId, label: "<div id=" + "\"" + this.overlayId + "_delete\"" + "class=\"close2-thik\"></div><div class=\"centerTransitionText\"/><div>Input</div><div>Transition</div></div>", cssClass : this.cssClass + " jtk-drag-select"}]);
		
		//Store the id
		for(var key in this.connection.getOverlays()) {
			if(this.connection.getOverlays()[key].hasOwnProperty("label")) {
				  this.htmlId = this.connection.getOverlays()[key].canvas.id;
				  break;
			}
		}
		
		//Setup double click
		$("#"+this.htmlId).dblclick($.proxy(this.doubleClick, this));
		
		//Setup delete click
		$("#" + this.overlayId + "_delete").click($.proxy(this.remove, this));
	}
	
	setupValidationRules() {
		this.validationRules.push(new TransitionValidationRule());
	}
	
	onChange(oEvent) {
		for(var i = 0; i < this.validationRules.length; i++) {
			this.validationRules[i].validate(this);
		}
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
	
	updateActiveScope() {
		
	}
	
	static load(loadData) {
		
		var connection = null;
		
		//Get the connection is transition should be placed on
		for(var n = 0; n < GameEditor.getEditorController().jsPlumbInstance.getConnections().length; n++) {
			if(GameEditor.getEditorController().jsPlumbInstance.getConnections()[n].id == loadData.connection) {
				connection = GameEditor.getEditorController().jsPlumbInstance.getConnections()[n];
				break;
			}
		}
		
		//Place the transition
		var inputTransition = new InputTransition("transition", connection, loadData.transitionId, this);
		GameEditor.getEditorController().transitionList.push(inputTransition);
		
		//Load the component data
		inputTransition.loadComponents(loadData);
	}
	
	loadComponents(loadData) {
		for(var key in loadData.activeTransitions) {
			for(var n = 0; n < this.modelJSON.iconTabs.length; n++) {
				if(key == this.modelJSON.iconTabs[n].scope) {
					this.modelJSON.iconTabs[n].activeTransition = loadData.activeTransitions[key];
				}
			}
		}
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			if(this.modelJSON.iconTabs[i].activeTransition == "Single Button Press") {
				for(var key in loadData.singleButtonPresses) {
					if(key == this.modelJSON.iconTabs[i].scope) {
						this.modelJSON.iconTabs[i].singlePress[0].selected = loadData.singleButtonPresses[key].button1;
						this.modelJSON.iconTabs[i].singlePress[1].selected = loadData.singleButtonPresses[key].button2;
						this.modelJSON.iconTabs[i].singlePress[2].selected = loadData.singleButtonPresses[key].button3;
						this.modelJSON.iconTabs[i].singlePress[3].selected = loadData.singleButtonPresses[key].button4;
					}
				}
			} else if(this.modelJSON.iconTabs[i].activeTransition == "Sequence Button Press") {
				
			}
		}
	}
	
	save() {
		var activeTransitions = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			activeTransitions[this.modelJSON.iconTabs[i].scope] = this.modelJSON.iconTabs[i].activeTransition;
		}
		var singleButtonPresses = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			if(this.modelJSON.iconTabs[i].activeTransition == "Single Button Press") {
				if(this.modelJSON.iconTabs[i].singlePress[0].selected || this.modelJSON.iconTabs[i].singlePress[1].selected
				 ||this.modelJSON.iconTabs[i].singlePress[2].selected || this.modelJSON.iconTabs[i].singlePress[3].selected) {
					singleButtonPresses[this.modelJSON.iconTabs[i].scope] = {
						button1 : this.modelJSON.iconTabs[i].singlePress[0].selected,
						button2 : this.modelJSON.iconTabs[i].singlePress[1].selected,
						button3 : this.modelJSON.iconTabs[i].singlePress[2].selected,
						button4 : this.modelJSON.iconTabs[i].singlePress[3].selected
					}
				}
			} else if(this.modelJSON.iconTabs[i].activeTransition == "Sequence Button Press") {
				
			}
		}
		
		var saveData = {
			transitionId : this.overlayId,
			connection : this.connection.id,
			activeTransitions : activeTransitions,
			singleButtonPresses : singleButtonPresses
		}
		
		return saveData;
	}
	
	doubleClick() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransition", this);
		
		//Set the model for the dialog
		this.dialog.setModel(this.model);
			
		//Open the dialog
		this.dialog.open();
	}
	
	createData() {
		return {
			icon : "",
			scope : "",
			activeTransition : "Single Button Press",
			singlePress : [
				{
					selected : false,
					enabled : true
				},
				{
					selected : false,
					enabled : true
				},
				{
					selected : false,
					enabled : true
				},
				{
					selected : false,
					enabled : true
				},
			],
//			singlePress : {
//				button1 : false,
//				button2 : false,
//				button3 : false,
//				button4 : false,
//				button1Enabled : true,
//				button2Enabled : true,
//				button3Enabled : true,
//				button4Enabled : true
//			}
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
	
	transitionTypeSelected(oEvent, oParam) {
		this.model.setProperty(oEvent.getParameters().listItem.getBindingContext().getPath() + "/activeTransition", oEvent.getParameters().listItem.getTitle());
		var navContainer = oEvent.oSource.getParent().getContentAreas()[1];
		for(var i = 0; i < navContainer.getPages().length; i++) {
			if(navContainer.getPages()[i].getTitle().includes(oEvent.getParameters().listItem.getTitle())) {
				navContainer.to(navContainer.getPages()[i]);
				break;
			}
		}
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
	
	remove() {
		
		//Open a dialog so the user can confirm the delete
		sap.m.MessageBox.confirm("Are you sure you want to delete this transition?", {onClose : $.proxy(this.removeTransition, this)});
	}
	
	removeTransition(oAction) {
		
		//If they click OK, delete
		if(oAction == sap.m.MessageBox.Action.OK) {
			
			//Remove the overlay
			this.connection.removeOverlay(this.overlayId);
			
			//Remove it from the list
			GameEditor.getEditorController().transitionList.splice(GameEditor.getEditorController().transitionList.indexOf(this), 1);
		}
	}
	
}