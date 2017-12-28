/**
 * 
 */

var StartState = class StartState extends State {
	
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
	
	static load(loadData) {
		//Create a new start state
		var startState = new StartState("startStateTopColor", "startStateBottomColor", "Start State" , loadData.stateId, GameEditor.getEditorController().jsPlumbInstance);
		
		//Set the position
		startState.setPositionX(loadData.positionX); startState.setPositionY(loadData.positionY);
		
		//Redraw it
		startState.draw();
		
		//Push back the state
		GameEditor.getEditorController().stateList.push(startState);
	}
	
	save() {
		var saveData = {
			stateId : this.htmlId,
			positionX : this.positionX,
			positionY : this.positionY,
			stateType : "START_STATE"
		}
		return saveData;
	}
}