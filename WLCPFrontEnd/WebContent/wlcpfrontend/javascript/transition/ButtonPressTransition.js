/**
 * 
 */

var ButtonColor = {
		RED: "#C0584D",
		GREEN: "#659242",
		BLUE: "#1D739D",
		BLACK: "black",
		ANY: "#5E696E"
};

var model = {
		data : []
}

class ButtonPressTransition extends GameEditor.Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		super(cssClass, connection, overlayId, gameEditor);
		this.colorCount = 0;
		this.buttonColor = ButtonColor.ANY;
		this.verify();
		this.create();
		this.generateData(3,3);
	}
	
	onChange() {
		//Check if any game wide boxes have been checked
		for(var i = 1; i <= sap.ui.getCore().byId("buttonTable").getRows()[0].getCells().length - 1; i++) {
			if(sap.ui.getCore().byId("buttonTable").getRows()[0].getCells()[i].getSelected()) {
				for(var n = 1; n <= sap.ui.getCore().byId("buttonTable").getModel().oData.data.length - 1; n++) {
					for(var o = 1; o <= sap.ui.getCore().byId("buttonTable").getRows()[n].getCells().length - 1; o++) {
						sap.ui.getCore().byId("buttonTable").getRows()[n].getCells()[o].setEditable(false);
					}
				}
			}
		}
	}
	
	verify() {
		
		//Get the connections of the state the transitions originates from
		var connections = this.jsPlumbInstance.getConnections({source : this.connection.source.id});
		
		//Loop through all of the connections
		for(var i = 0; i < connections.length; i++) {
			
			//Loop through the overlays in the connections
			for(var key in connections[i].getOverlays()) {
				
				//If its a label we are interested
				if(connections[i].getOverlays()[key].id.includes("buttonPressTransition")) {
					var buttonPressTransition = this.gameEditor.transitionMap.get(connections[i].getOverlays()[key].id);
					if(buttonPressTransition.getButtonColor() == ButtonColor.ANY) {
						console.log("Cannot add");
					}
				}
			}
		}

	}
	
	createData() {
		return {
			scope : "",
			any : false,
			red : false,
			green : false,
			blue : false,
			black : false
		}
	}
	
	generateData(teams, playersPerTeam) {
		var baseData = this.createData();
		baseData.scope = "Game Wide";
		model.data.push(baseData);
		
		//Add the teams
		for(var i = 0; i < teams; i++) {
			baseData = this.createData();
			baseData.scope = "Team " + (i + 1);
			model.data.push(baseData);
		}
		
		//Add the players
		for(var i = 0; i < teams * playersPerTeam; i++) {
			baseData = this.createData();
			baseData.scope = "Player " + (i + 1);
			model.data.push(baseData);
		}	
	}
	
	create() {
		
		//Add the overlay
		this.connection.addOverlay([ "Label", {id : this.overlayId, label: "<div class=\"centerTransitionText\"/><div>Button</div><div>Press</div></div>", cssClass : this.cssClass + " jtk-drag-select"}]);
		
		//Store the id
		for(var key in this.connection.getOverlays()) {
			if(this.connection.getOverlays()[key].hasOwnProperty("label")) {
				  this.htmlId = this.connection.getOverlays()[key].canvas.id;
				  break;
			}
		}
		
		//Setup double click
		$("#"+this.htmlId).dblclick($.proxy(this.doubleClick, this));
	}
	
	setButtonColor(color) {
		this.buttonColor = color;
		document.getElementById(this.htmlId).style.backgroundColor = this.buttonColor;
	}
	
	getButtonColor() {
		return this.buttonColor;
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
	
	doubleClick() {
		
//		var busy = new sap.m.BusyDialog();
//		busy.open();
//		
//		//Create an instance of the dialog
//		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.test", this);
//		this.dialog.setModel(new sap.ui.model.json.JSONModel(model));
//		this.dialog.open();
//		busy.close();
		
//		console.log("Transition Clicked");
		if(this.colorCount == 0) {
			this.setButtonColor(ButtonColor.RED);
			this.colorCount++;
		} else if(this.colorCount == 1) {
			this.setButtonColor(ButtonColor.GREEN);
			this.colorCount++;
		} else if(this.colorCount == 2) {
			this.setButtonColor(ButtonColor.BLUE);
			this.colorCount++;
		} else if(this.colorCount == 3) {
			this.setButtonColor(ButtonColor.BLACK);
			this.colorCount++;
		} else if(this.colorCount == 4) {
			this.setButtonColor(ButtonColor.ANY);
			this.colorCount = 0;
		}
	}
}