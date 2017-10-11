sap.ui.controller("wlcpfrontend.controllers.GameEditor", {

	pageId : "gameEditor",
	stateId : "state",
	stateIdCount : 0,
	
	jsPlumbInstance : null,
	
	initJsPlumb : function() {
		this.jsPlumbInstance = jsPlumb.getInstance();
		this.jsPlumbInstance.importDefaults({Connector: ["Bezier"], ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8,
                paintStyle:{ fill: "#000000" }
            }]
        ]});
	},
	
	initStartState : function() {
		
		//Create a new start state
		var startState = new StartState("startStateTopColor", "startStateBottomColor", "Start State" , "start", this.jsPlumbInstance);
		
		//Set the position
		startState.setPositionX(((document.getElementById("gameEditor--pad").offsetWidth / 2) - (150 / 2))); startState.setPositionY(100);
		
		//Redraw it
		startState.draw();
	},	
	
	initToolbox : function() {
		$("#gameEditor--toolboxDisplayState").draggable({ revert: false, helper: "clone", start : this.dragStart, stop : $.proxy(this.stateDragStop, this)});
		$("#gameEditor--toolboxBuzzerState").draggable({ revert: false, helper: "clone", start : this.dragStart, stop : $.proxy(this.stateDragStop, this)});
		$("#gameEditor--toolboxLEDState").draggable({ revert: false, helper: "clone", start : this.dragStart, stop : $.proxy(this.stateDragStop, this)});
	},
	
	initToolbox2 : function() {
		$("#gameEditor--buttonPressTransition").draggable({ revert: false, helper: "clone", start : this.dragStart, stop : $.proxy(this.transitionDragStop, this)});
	},
	
	onItemSelect : function(oEvent) {
		setTimeout(function(t) {
			t.initToolbox2();
		}, 500, this);
	},	
	
	dragStart : function() {
		document.getElementById("gameEditor--mainSplitter-content-0").style.overflow = "visible";
		document.getElementById("gameEditor--toolbox").style["overflow-x"] = "visible";
		document.getElementById("gameEditor--toolbox").style["overflow-y"] = "visible";
	},
	
	stateDragStop : function(event, ui) {
		document.getElementById("gameEditor--mainSplitter-content-0").style.overflow = "auto";
		document.getElementById("gameEditor--toolbox").style["overflow-x"] = "hidden";
		document.getElementById("gameEditor--toolbox").style["overflow-y"] = "auto";
		
		switch(ui.helper[0].childNodes[1].className) {
			case "toolboxDisplayStateTopColor":
				var displayState = new DisplayState("toolboxDisplayStateTopColor", "toolboxDisplayStateBottomColor", "Display Text" , this.createStateId(), this.jsPlumbInstance);
				displayState.setPositionX(displayState.absoluteToRelativeX(ui.position.left)); displayState.setPositionY(displayState.absoluteToRelativeY(ui.position.top));
				displayState.draw();
				break;
			case "toolboxBuzzerStateTopColor":
				var buzzerState = new BuzzerState("toolboxBuzzerStateTopColor", "toolboxBuzzerStateBottomColor", "Buzzer Sound" , this.createStateId(), this.jsPlumbInstance);
				buzzerState.setPositionX(buzzerState.absoluteToRelativeX(ui.position.left)); buzzerState.setPositionY(buzzerState.absoluteToRelativeY(ui.position.top));
				buzzerState.draw();
				break;
			case "toolboxLEDStateTopColor":
				var ledState = new LEDState("toolboxLEDStateTopColor", "toolboxLEDStateBottomColor", "LED" , this.createStateId(), this.jsPlumbInstance);
				ledState.setPositionX(ledState.absoluteToRelativeX(ui.position.left)); ledState.setPositionY(ledState.absoluteToRelativeY(ui.position.top));
				ledState.draw();
				break;
		}
	},
	
	transitionDragStop : function(event, ui) {
		document.getElementById("gameEditor--mainSplitter-content-0").style.overflow = "auto";
		document.getElementById("gameEditor--toolbox").style["overflow-x"] = "hidden";
		document.getElementById("gameEditor--toolbox").style["overflow-y"] = "auto";
		
		var connection = Transition.getClosestConnection(ui.position.left, ui.position.top, this.jsPlumbInstance);
		if(connection != null) {
			if(ui.helper[0].className.includes("buttonPressTransition")) {
				var buttonPressTransition = new ButtonPressTransition("transition", connection, this.jsPlumbInstance);
			}
		}
	},
	
	createStateId : function() {
		this.stateIdCount++;
		return this.stateId + this.stateIdCount;
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.GameEditor
*/
	onInit: function() {
		this.getView().byId("gameEditor").addEventDelegate({
			  onAfterRendering: function(){
				  
				  //Wait for the inital DOM to render
				  //Init jsPlumb
				  this.initJsPlumb();
				  
				  //Init the start state
				  this.initStartState();
				  
				  //Setup the toolbox drag and drop
				  this.initToolbox();
			  }
			}, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.GameEditor
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.GameEditor
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.GameEditor
*/
//	onExit: function() {
//
//	}

});