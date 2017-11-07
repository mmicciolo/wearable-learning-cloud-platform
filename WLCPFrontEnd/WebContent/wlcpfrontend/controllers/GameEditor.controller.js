sap.ui.controller("wlcpfrontend.controllers.GameEditor", {

	oModel : null,
	
	newGameModel : {
		GameId : "",
		TeamCount : 0,
		PlayersPerTeam : 0,
		StateIdCount : 0,
		UsernameDetails : {
			__metadata : {
	             uri : ODataModel.getODataModelURL() + "/Usernames('mmicciolo')"
	         }
		},
		Visibility : true
	},
	
	gameModel : {
		GameId : "",
		TeamCount : 0,
		PlayersPerTeam : 0,
		StateIdCount : 0,
		Visibility : true
	},
	
	stateId : "state",
	stateIdCount : 0,
	transitionIdCount : 0,
	
	stateList : [],
	connectionList : [],
	transitionMap : new Map(),
	
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
		this.jsPlumbInstance.bind("beforeDrop", $.proxy(this.connectionDropped, this));
	},
	
	initStartState : function() {
		
		//Create a new start state
		var startState = new StartState("startStateTopColor", "startStateBottomColor", "Start State" , "start", this.jsPlumbInstance);
		
		//Set the position
		startState.setPositionX(((document.getElementById("gameEditor--pad").offsetWidth / 2) - (150 / 2))); startState.setPositionY(100);
		
		//Redraw it
		startState.draw();
		
		//Push back the state
		this.stateList.push(startState);
		
		//Save it
		startState.save();
	},	

	initToolbox : function() {
		$("#gameEditor--toolboxDisplayTextState").draggable({ revert: false, helper: "clone", start : this.dragStart, stop : $.proxy(this.stateDragStop, this)});
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
			case "toolboxDisplayTextStateTopColor":
				var displayTextState = new DisplayTextState("toolboxDisplayTextStateTopColor", "toolboxDisplayTextStateBottomColor", "Display Text" , this.createStateId(), this.jsPlumbInstance);
				displayTextState.setPositionX(displayTextState.absoluteToRelativeX(ui.position.left)); displayTextState.setPositionY(displayTextState.absoluteToRelativeY(ui.position.top));
				displayTextState.draw();
				this.stateList.push(displayTextState);
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
				var transitionId = "buttonPressTransition" + this.createTransitionId();
				var buttonPressTransition = new ButtonPressTransition("transition", connection, transitionId, this);
				this.transitionMap.set(transitionId, buttonPressTransition);
			}
		}
	},
	
	connectionDropped : function(oEvent) {
		this.connectionList.push(new Connection(oEvent.sourceId, oEvent.targetId, oEvent.connection.id));
		return true;
	},
	
	createStateId : function() {
		this.gameModel.StateIdCount++;
		return this.stateId + this.gameModel.StateIdCount;
	},
	
	createTransitionId : function() {
		this.transitionIdCount++;
		return this.transitionIdCount;
	},
	
	newGame : function() {
		var fragment = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.CreateGame", sap.ui.controller("wlcpfrontend.controllers.CreateLoadGame"));
		fragment.setModel(new sap.ui.model.json.JSONModel(this.newGameModel));
		fragment.open();
	},
	
	initNewGame : function() {
		
		//Init jsPlumb
		this.initJsPlumb();
		  
		//Init the start state
		this.initStartState();
		  
		//Setup the toolbox drag and drop
		this.initToolbox();
	},
	
	loadGame : function() {
		var fragment = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.LoadGame", sap.ui.controller("wlcpfrontend.controllers.CreateLoadGame"));
		fragment.setModel(ODataModel.getODataModel());
		fragment.open();
	},
	
	loadFSM() {
		//Open the busy dialog
		this.busy = new sap.m.BusyDialog();
		this.busy.open();
		
		//Init jsPlumb
		this.initJsPlumb();
		
		//Setup the toolbox drag and drop
		this.initToolbox();
		
		//Setup some FSM variables
		this.loadCount = 0;
		this.type = "STATE";
		
		//Kick off the save
		State.load();
	},
	
	initLoadedGame : function() {
		
	},
	
	saveGame : function() {
		
		//Open the busy dialog
		this.busy = new sap.m.BusyDialog();
		this.busy.open();
		
		//Setup some FSM variables
		this.saveCount = 0;
		this.type = "STATE";
		
		//Update the state count
		//this.gameModel.StateIdCount = this.stateIdCount;
		ODataModel.getODataModel().update("/Games('" + this.gameModel.GameId + "')", this.gameModel);
		
		//Kick off the save
		this.stateList[this.saveCount].save();
	},
	
	saveFSM() {
		this.saveCount++;
		switch(this.type) {
		case "STATE":
			if(this.stateList[this.saveCount] != null) {
				this.stateList[this.saveCount].save();
			} else {
				this.saveCount = -1;
				this.type = "CONNECTION";
				this.saveFSM();
			}
			break;
		case "CONNECTION":
			if(this.connectionList[this.saveCount] != null) {
				this.connectionList[this.saveCount].save();
			} else {
				this.busy.close();
				sap.m.MessageToast.show("Game Saved Successfully!");
			}
			break;
		}
	},
	
	resetEditor : function() {
		for(var i = 0; i < this.stateList.length; i++) {
			this.jsPlumbInstance.remove(this.stateList[i].htmlId);
		}
		this.stateList = [];
		this.connectionList = [];
		this.saveCount = null;
		this.type = null;
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.GameEditor
*/
	onInit: function() {
		GameEditor.getEditor().addEventDelegate({
			  onAfterRendering: function(){
				  
				  //Load the data model
				  ODataModel.setupODataModel();
				  
					var fragment = sap.ui.xmlfragment("wlcpfrontend.fragments.test2", sap.ui.controller("wlcpfrontend.controllers.test2"));
					//fragment.setModel(ODataModel.getODataModel());
					fragment.open();
				  
				  //Wait for the inital DOM to render
				  //Init jsPlumb
				  //this.initJsPlumb();
				  
				  //Init the start state
				  //this.initStartState();
				  
				  //Setup the toolbox drag and drop
				  //this.initToolbox();
				  
				  //ButtonPressTransition.doubleClick();
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