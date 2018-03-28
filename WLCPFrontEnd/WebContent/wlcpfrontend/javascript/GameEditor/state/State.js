/**
 * 
 */

var StateType = {
		START_STATE : "START_STATE",
		OUTPUT_STATE : "OUTPUT_STATE"
}

var State = class State {
	
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
		this.inputConnections = [];
		this.outputConnections = [];
	}
	
	static absoluteToRelativeX(absoluteX, width) {
		return absoluteX - (document.getElementById("gameEditor--toolbox").getBoundingClientRect().width + document.getElementById("gameEditor--mainSplitter-splitbar-0").getBoundingClientRect().width + (width / 2));
	};
	
	static absoluteToRelativeY(absoluteY) {
		return absoluteY + document.getElementById("gameEditor--toolbox-scroll").offsetHeight - 20;
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
		topColorText.id = this.htmlId + "-description";
		topColorText.className = "centerStateText";
		topColorText.innerHTML = this.text;
		topColorDiv.appendChild(topColorText);
		
		if(!this.stateDiv.id.includes("start")) {
			//Delete Button
			var deleteButton = document.createElement('div');
			deleteButton.id = this.htmlId + "delete";
			deleteButton.className = "close-thik";
			topColorDiv.appendChild(deleteButton);	
		}
		
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
		this.jsPlumbInstance.draggable(this.stateDiv.id, {containment : true, drag : $.proxy(this.moved, this), stop : $.proxy(this.moved, this)});
		//$("#" + this.stateDiv.id).draggable({containment : "parent", stop : $.proxy(this.moved, this)});
		
		if(!this.stateDiv.id.includes("start")) {
			//Make delete clickable
			$("#" + deleteButton.id).click($.proxy(this.remove, this));
		}
	}
	
	remove() {
		
		//Open a dialog so the user can confirm the delete
		sap.m.MessageBox.confirm("Are you sure you want to delete this state?", {onClose : $.proxy(this.removeState, this)});
	}
	
	removeState(oAction) {
		
		//If they click OK, delete
		if(oAction == sap.m.MessageBox.Action.OK) {
			
			//Remove all connections
			this.jsPlumbInstance.deleteConnectionsForElement(this.htmlId);
			
			//Remove the state element
			this.jsPlumbInstance.remove(this.htmlId);
			
			//Remove ourself from the connection list
			GameEditor.getEditorController().stateList.splice(GameEditor.getEditorController().stateList.indexOf(this), 1);
			
	    	//Revalidate the transitions
	    	for(var i = 0; i < GameEditor.getEditorController().transitionList.length; i++) {
	    		for(var n = 0; n < GameEditor.getEditorController().transitionList[i].validationRules.length; n++) {
	    			GameEditor.getEditorController().transitionList[i].validationRules[n].validate(GameEditor.getEditorController().transitionList[i]);
	    		}
	    	}
	    	
	    	//Revalidate the states
	    	for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
	    		if(!GameEditor.getEditorController().stateList[i].htmlId.includes("start")) {
	        		for(var n = 0; n < GameEditor.getEditorController().stateList[i].validationRules.length; n++) {
	        			GameEditor.getEditorController().stateList[i].validationRules[n].validate(GameEditor.getEditorController().stateList[i]);
	        		}
	    		}
	    	}
		}
	}
	
	draw() {

		//Set the start position
		document.getElementById(this.stateDiv.id).style.left = this.positionX + "px";
		document.getElementById(this.stateDiv.id).style.top = this.positionY + "px";
		
		//Repaint
		this.jsPlumbInstance.revalidate(this.stateDiv.id);
	}
	
	moved() {
		
		//Update the position
		this.positionX = parseFloat(document.getElementById(this.htmlId).style.left.replace("px", ""));
		this.positionY = parseFloat(document.getElementById(this.htmlId).style.top.replace("px", ""));
		
		if((this.positionX + this.width + 50) >= document.getElementById("gameEditor--pad").getBoundingClientRect().width) {
			document.getElementById("gameEditor--pad").style.width = (document.getElementById("gameEditor--pad").getBoundingClientRect().width + 500) + "px";
		}
		if((this.positionY + this.height + 50) >= document.getElementById("gameEditor--pad").getBoundingClientRect().height) {
			document.getElementById("gameEditor--pad").style.height = (document.getElementById("gameEditor--pad").getBoundingClientRect().height + 500) + "px";
		}
	}
	
	save() {
		return [];
	}
	
	changeText(text) {
		document.getElementById(this.htmlId + "-description").innerHTML = text;
		this.text = text;
	}
	
	getPositionX() {
		return this.positionX;
	}
	
	getPositionY() {
		return this.positionY;
	}
	
	setPositionX(positionX) {
		this.positionX = parseFloat(positionX);
	}
	
	setPositionY(positionY) {
		this.positionY = parseFloat(positionY);
	}
	
	getHtmlId() {
		return this.htmlId;
	}
	
	static getStateById(stateId) {
		var stateList = GameEditor.getEditorController().stateList;
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(stateList[i].htmlId == stateId) {
				return stateList[i];
			}
		}
	}
}