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
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "output", anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
	}
	
	static loadData(oData) {
		//Create a new start state
		var startState = new StartState("startStateTopColor", "startStateBottomColor", "Start State" , oData.GameStateId, GameEditor.getEditorController().jsPlumbInstance);
		
		//Set the position
		startState.setPositionX(oData.PositionX); startState.setPositionY(oData.PositionY);
		
		//Redraw it
		startState.draw();
		
		//Push back the state
		GameEditor.getEditorController().stateList.push(startState);
	}
	
	save() {
		super.save("/StartStates", this.saveState, this);
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
			}
		}
		
		super.saveState(oData, super.saveSuccess, "/StartStates", saveData);
	}
}