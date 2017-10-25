/**
 * 
 */

var StateType = {
		START_STATE : "START_STATE",
		DISPLAY_TEXT_STATE : "DISPLAY_TEXT_STATE"
}

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
		this.inputConnections = [];
		this.outputConnections = [];
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
		
		if(this.stateDiv.id != "start") {
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
		this.jsPlumbInstance.draggable(this.stateDiv.id, {containment : true, stop : $.proxy(this.moved, this)});
		
		if(this.stateDiv.id != "start") {
			//Make delete clickable
			$("#" + deleteButton.id).click($.proxy(this.remove, this));
		}
	}
	
	remove() {
		console.log("clcik");
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
	}
	
	static loadData(oData) {
		return this;
	}
	
	static load() {
		var filters = [];
		filters.push(new sap.ui.model.Filter({path: "Game", operator: sap.ui.model.FilterOperator.EQ, value1: sap.ui.getCore().byId("gameEditor").getController().gameModel.GameId}));
		sap.ui.getCore().getModel("odata").read("/States", {filters: filters, success: $.proxy(this.loadSuccess, this), error: this.saveError});
	}
	
	static loadSuccess(oData) {
		for(var i = 0; i < oData.results.length; i++) {
			switch(oData.results[i].StateType) {
			case StateType.START_STATE:
				StartState.loadData(oData.results[i]);
				break;
			case StateType.DISPLAY_TEXT_STATE:
				DisplayState.loadData(oData.results[i]);
				break;
			}
		}
		
		//Load Connections
		Connection.load();
	}
	
	save(odataPath, saveSuccess, context) {
		var filters = [];
		filters.push(new sap.ui.model.Filter({path: "Game", operator: sap.ui.model.FilterOperator.EQ, value1: sap.ui.getCore().byId("gameEditor").getController().gameModel.GameId}));
		filters.push(new sap.ui.model.Filter({path: "GameStateId", operator: sap.ui.model.FilterOperator.EQ, value1: this.htmlId}));
		
		//Read in the state data
		sap.ui.getCore().getModel("odata").read(odataPath, {filters: filters, success: $.proxy(saveSuccess, context), error: this.saveError});
	}
	
	saveState(oData, odataPath, saveData) {
		if(oData.results.length == 1) {
			
			//We need to update the entry
			sap.ui.getCore().getModel("odata").update(odataPath + "(" + oData.results[0].StateId + ")", saveData, {success: this.saveSuccess, error: this.saveError});
				
		} else if(oData.results.length == 0) {
			
			//We need to create the entry
			sap.ui.getCore().getModel("odata").create(odataPath, saveData, {success: this.saveSuccess, error: this.saveError});

		} else {
			//Something went terribly wrong...
		}
	}
	
	saveSuccess() {
		sap.ui.getCore().byId("gameEditor").getController().saveFSM();
	}
	
	saveError() {
		sap.m.MessageBox.error("There was an error saving the game.");
		sap.ui.getCore().byId("gameEditor").getController().busy.close();
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
}