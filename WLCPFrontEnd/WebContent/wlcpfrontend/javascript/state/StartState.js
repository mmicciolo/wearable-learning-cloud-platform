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
	
	save(gameName) {
		
		this.gameName = gameName;
		var filters = [];
		filters.push(new sap.ui.model.Filter({

                     path: "Game",

                     operator: sap.ui.model.FilterOperator.EQ,

                     value1: gameName

              }));
		filters.push(new sap.ui.model.Filter({

            path: "GameStateId",

            operator: sap.ui.model.FilterOperator.EQ,

            value1: this.htmlId

     }));
		//Read in the state data
		sap.ui.getCore().getModel("odata").read("/States", {filters : filters, success : $.proxy(this.saveState, this)});
		
//		var saveData = {
//				GameDetails : {
//					__metadata : {
//			             uri : "http://localhost:8080/WLCPWebApp/WLCPOData.svc/Games('" + gameName + "')"
//			         }
//				},
//				StateId : 0,
//				GameStateId : this.htmlId,
//				PositionX : this.positionX,
//				PositionY : this.positionY	
//		}
//		sap.ui.getCore().getModel("odata").create("/States", saveData);
	}

	saveState(oData) {
		
		var saveData = {
			StateId : 0,
			GameStateId : this.htmlId,
			PositionX : this.positionX,
			PositionY : this.positionY,
			GameDetails : {
				__metadata : {
		             uri : "http://localhost:8080/WLCPWebApp/WLCPOData.svc/Games('" + this.gameName + "')"
		         }
			}
		}
		
		if(oData.results.length == 1) {
			
			//We need to update the entry
			sap.ui.getCore().getModel("odata").update("/States(" + oData.results[0].StateId + ")", saveData);
				
		} else if(oData.results.length == 0) {
			
			//We need to create the entry
			sap.ui.getCore().getModel("odata").create("/States", saveData);

		} else {
			//Something went terribly wrong...
		}
	}
}