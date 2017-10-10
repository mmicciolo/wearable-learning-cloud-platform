/**
 * 
 */

class StartState extends State {
	
	constructor(positionX, positionY, htmlId) {
		super(positionX, positionY, htmlId);
		this.outputEndPoint = {
				 endpoint:"Dot",
				 isTarget:false,
				 isSource:true,
				 maxConnections: -1,
			};
	}
	
//	createDiv() {
//		
//		//Main div
//		var startStateDiv = document.createElement('div');
//		startStateDiv.id = "start";
//		startStateDiv.className = "newstate stateBorderShadow";
//		
//		//Top color
//		var topColorDiv = document.createElement('div');
//		topColorDiv.className = "startStateTopColor";
//		
//		//Top Color Text
//		var topColorText = document.createElement('div');
//		topColorText.className = "centerText";
//		topColorText.innerHTML = "Start State";
//		topColorDiv.appendChild(topColorText);
//		
//		//Bottom color
//		var bottomColorDiv = document.createElement('div');
//		bottomColorDiv.className = "startStateBottomColor";
//		
//		//Append
//		startStateDiv.appendChild(topColorDiv);
//		startStateDiv.appendChild(bottomColorDiv);
//		
//		this.stateDiv = startStateDiv;
//	}
	
	drawDiv(jsPlumbInstance) {
	
		//Call the super method
		super.drawDiv(jsPlumbInstance);
		
		//Setup the end points
		jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
	}
	
}