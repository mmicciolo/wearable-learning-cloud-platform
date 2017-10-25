/**
 * 
 */

class DisplayState extends State {
	
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
		this.create();
	}
	
	create() {
		
		//Call the super method
		super.create();
		
		//Setup the end points
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Top", paintStyle:{ fill: "#5E696E" } }, this.inputEndPoint);
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
		
		//Setup double click
		//$("#"+this.stateDiv.id).dblclick(this.doubleClick);
	}
	
	doubleClick() {
		//Create an instance of the dialog
		var dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameLobbies.CreateGameLobby", this);
		
		//Open the dialog
		this.getView().addDependent(this.dialog);
		dialog.open();
	}
	
	static loadData(oData) {
		//Create a new dispaly state
		var displayState = new DisplayState("toolboxDisplayStateTopColor", "toolboxDisplayStateBottomColor", "Display Text", oData.GameStateId, sap.ui.getCore().byId("gameEditor").getController().jsPlumbInstance);
		
		//Set the position
		displayState.setPositionX(oData.PositionX); displayState.setPositionY(oData.PositionY);
		
		//Redraw it
		displayState.draw();
		
		//Push back the state
		sap.ui.getCore().byId("gameEditor").getController().stateList.push(displayState);
	}
	
	save() {
		super.save("/DisplayTextStates", this.saveState, this);
	}

	saveState(oData) {
		
		var saveData = {
			StateId : 0,
			GameStateId : this.htmlId,
			PositionX : this.positionX,
			PositionY : this.positionY,
			GameDetails : {
				__metadata : {
		             uri : "http://localhost:8080/WLCPWebApp/WLCPOData.svc/Games('" + sap.ui.getCore().byId("gameEditor").getController().gameModel.GameId + "')"
		         }
			},
			DisplayText : "TEXT"
		}
		
		super.saveState(oData, "/DisplayTextStates", saveData);
	}
}