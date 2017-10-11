/**
 * 
 */
class State {
	
	constructor(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance) {
		this.topColorClass = topColorClass;
		this.bottomColorClass = bottomColorClass;
		this.text = text;
		this.positionX = 0;
		this.positionY = 0;
		this.width = 0;
		this.height = 0;
		this.jsPlumbInstance = jsPlumbInstance;
		this.htmlId = htmlId;
		this.stateDiv = null;
	}
	
	absoluteToRelativeX(absoluteX) {
		return absoluteX - (document.getElementById("gameEditor--toolbox").getBoundingClientRect().width + document.getElementById("gameEditor--mainSplitter-splitbar-0").getBoundingClientRect().width + (this.width / 2));
	};
	
	absoluteToRelativeY(absoluteY) {
		return absoluteY + document.getElementById("gameEditor--toolbox-scroll").offsetHeight;
	};
	
	create() {
		//Main div
		this.stateDiv = document.createElement('div');
		this.stateDiv.id = this.htmlId;
		this.stateDiv.className = "state stateBorderShadow jtk-drag-select";
		
		//Top color
		var topColorDiv = document.createElement('div');
		topColorDiv.className = this.topColorClass;
		
		//Top Color Text
		var topColorText = document.createElement('div');
		topColorText.className = "centerStateText";
		topColorText.innerHTML = this.text;
		topColorDiv.appendChild(topColorText);
		
		//Bottom color
		var bottomColorDiv = document.createElement('div');
		bottomColorDiv.className = this.bottomColorClass;
		
		//Append
		this.stateDiv.appendChild(topColorDiv);
		this.stateDiv.appendChild(bottomColorDiv);
		
		//Add the div to the pad
		document.getElementById('gameEditor--pad').appendChild(this.stateDiv);
		
		//Get the width and height
		this.width = this.stateDiv.getBoundingClientRect().width;
		this.height = this.stateDiv.getBoundingClientRect().height;
		
		//Make it draggable
		this.jsPlumbInstance.draggable(this.stateDiv.id, {containment : true});
	}
	
	draw() {

		//Set the start position
		document.getElementById(this.stateDiv.id).style.left = this.positionX + "px";
		document.getElementById(this.stateDiv.id).style.top = this.positionY + "px";
		
		//Repaint
		this.jsPlumbInstance.revalidate(this.stateDiv.id);
	}
	
	getPositionX() {
		return this.positionX;
	}
	
	getPositionY() {
		return this.positionY;
	}
	
	setPositionX(positionX) {
		this.positionX = positionX;
	}
	
	setPositionY(positionY) {
		this.positionY = positionY;
	}
	
	getHtmlId() {
		return this.htmlId;
	}
}