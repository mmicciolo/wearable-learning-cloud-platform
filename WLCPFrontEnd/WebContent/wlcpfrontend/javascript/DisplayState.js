/**
 * 
 */

class DisplayState extends State {
	
	constructor(positionX, positionY, htmlId) {
		super(positionX, positionY, htmlId);
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
	}
	
	drawDiv(jsPlumbInstance) {
		
		//Call the super method
		super.drawDiv(jsPlumbInstance);
		
		//Setup the end points
		jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Top", paintStyle:{ fill: "#5E696E" } }, this.inputEndPoint);
		jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
	}
	
}