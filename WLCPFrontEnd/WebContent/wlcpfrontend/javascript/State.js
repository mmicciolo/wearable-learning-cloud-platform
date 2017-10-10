/**
 * 
 */
class State {
	
	constructor(positionX, positionY, htmlId) {
		this.positionX = positionX;
		this.positionY = positionY;
		this.htmlId = htmlId;
		this.stateDiv = null;
	}
	
	createDiv(topColorClass, bottomColorClass, text) {
		//Main div
		this.stateDiv = document.createElement('div');
		this.stateDiv.id = this.htmlId;
		this.stateDiv.className = "state stateBorderShadow";
		
		//Top color
		var topColorDiv = document.createElement('div');
		topColorDiv.className = topColorClass;
		
		//Top Color Text
		var topColorText = document.createElement('div');
		topColorText.className = "centerStateText";
		topColorText.innerHTML = text;
		topColorDiv.appendChild(topColorText);
		
		//Bottom color
		var bottomColorDiv = document.createElement('div');
		bottomColorDiv.className = bottomColorClass;
		
		//Append
		this.stateDiv.appendChild(topColorDiv);
		this.stateDiv.appendChild(bottomColorDiv);
	}
	
	drawDiv(jsPlumbInstance) {
		
		//Add the div to the pad
		document.getElementById('gameEditor--pad').appendChild(this.stateDiv);
		
		//Set the start position
		document.getElementById(this.stateDiv.id).style.left = this.positionX + "px";
		document.getElementById(this.stateDiv.id).style.top = this.positionY + "px";

		//Make it draggable and add the end point
		jsPlumbInstance.draggable(this.stateDiv.id);
	}
	
	getPositionX() {
		return this.positionX;
	}
	
	getPositionY() {
		return this.positionY;
	}
	
	getHtmlId() {
		return this.htmlId;
	}
}