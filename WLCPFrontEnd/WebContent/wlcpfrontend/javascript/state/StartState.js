/**
 * 
 */

class StartState extends State {
	
	constructor(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance) {
		super(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance);
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
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
	}
	
	save() {
		super.save("/States", this.saveState, this);
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
			}
		}
		
		super.saveState(oData, "/States", saveData);
		
//		//Save our connections
//		var inputConnections = this.jsPlumbInstance.getConnections({target : this.htmlId});
//		var outputConnections = this.jsPlumbInstance.getConnections({source : this.htmlId});
//		
//		//Loop through and save input connections
//		if(inputConnections.length > 0) {
//			
//		}
//		
//		//Loop through and save output connections
//		for(var i = 0; i < outputConnections.length; i++) {
//			var connection = {
//					ConnectionId : 0,
//					StateDetails : {
//						__metadata : {
//				             uri : "http://localhost:8080/WLCPWebApp/WLCPOData.svc/States('" + this.gameName + "')"
//				         }
//					},
//					ConnectionFrom : this.htmlId,
//					ConnectionTo : outputConnections[i].target.id
//				}
//			sap.ui.getCore().getModel("odata").create("/Connections", connection);
//		}
	}
}