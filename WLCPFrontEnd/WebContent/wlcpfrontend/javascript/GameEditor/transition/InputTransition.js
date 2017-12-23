/**
 * 
 */

class InputTransition extends Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		super(cssClass, connection, overlayId, gameEditor);
		this.create();
		this.modelJSON = {
				iconTabs : []
		}
		this.modelJSON.iconTabs = this.generateData(3,3);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
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
		for(var key in loadData.singleButtonPresses) {
			for(var n = 0; n < this.modelJSON.iconTabs.length; n++) {
				if(key == this.modelJSON.iconTabs[n].scope) {
					this.modelJSON.iconTabs[n].singlePress.button1 = loadData.singleButtonPresses[key].button1;
					this.modelJSON.iconTabs[n].singlePress.button2 = loadData.singleButtonPresses[key].button2;
					this.modelJSON.iconTabs[n].singlePress.button3 = loadData.singleButtonPresses[key].button3;
					this.modelJSON.iconTabs[n].singlePress.button4 = loadData.singleButtonPresses[key].button4;
				}
			}
		}
	}
	
	save() {
		var singleButtonPresses = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			if(this.modelJSON.iconTabs[i].singlePress.button1 || this.modelJSON.iconTabs[i].singlePress.button2
			 ||this.modelJSON.iconTabs[i].singlePress.button3 || this.modelJSON.iconTabs[i].singlePress.button4) {
				singleButtonPresses[this.modelJSON.iconTabs[i].scope] = {
					button1 : this.modelJSON.iconTabs[i].singlePress.button1,
					button2 : this.modelJSON.iconTabs[i].singlePress.button2,
					button3 : this.modelJSON.iconTabs[i].singlePress.button3,
					button4 : this.modelJSON.iconTabs[i].singlePress.button4	
				}
			}
		}
		
		var saveData = {
			transitionId : this.overlayId,
			connection : this.connection.id,
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
			singlePress : {
				button1 : false,
				button2 : false,
				button3 : false,
				button4 : false
			}
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