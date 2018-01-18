sap.ui.controller("wlcpfrontend.controllers.GameEditor", {

	oModel : null,
	
	newGameModel : {
		GameId : "",
		TeamCount : 3,
		PlayersPerTeam : 3,
		StateIdCount : 0,
		TransitionIdCount : 0,
		ConnectionIdCount : 0,
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
		TransitionIdCount : 0,
		ConnectionIdCount : 0,
		Visibility : true
	},
	
	stateList : [],
	transitionList : [],
	connectionList : [],
	
	jsPlumbInstance : null,
	
	initJsPlumb : function() {
		this.jsPlumbInstance = jsPlumb.getInstance();
		this.jsPlumbInstance.importDefaults({Connector: ["Flowchart", {cornerRadius : 50}], ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8,
                paintStyle:{ fill: "#000000" }
            }]
        ]});
		this.jsPlumbInstance.bind("beforeDrop", $.proxy(this.connectionDropped, this));
		this.jsPlumbInstance.bind("beforeDetach", $.proxy(this.connectionDetached, this));
	},
	
	initStartState : function() {
		
		//Create a new start state
		var startState = new StartState("startStateTopColor", "startStateBottomColor", "Start State" , this.gameModel.GameId + "_start", this.jsPlumbInstance);
		
		//Set the position
		startState.setPositionX(((document.getElementById("gameEditor--pad").offsetWidth / 2) - (150 / 2))); startState.setPositionY(100);
		
		//Redraw it
		startState.draw();
		
		//Push back the state
		this.stateList.push(startState);
		
		//Save it
		this.saveGame();
	},	

	initToolbox : function() {
		$("#gameEditor--toolboxOutputState").draggable({ revert: false, helper: "clone", start : this.dragStart, stop : $.proxy(this.stateDragStop, this)});
		$("#gameEditor--toolboxTransition").draggable({ revert: false, helper: "clone", start : this.dragStart, stop : $.proxy(this.transitionDragStop, this)});
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
			case "toolboxOutputStateTopColor":
				if(State.absoluteToRelativeX(ui.position.left, 150) + GameEditor.getScrollLeftOffset() < 0 || State.absoluteToRelativeY(ui.position.top) + GameEditor.getScrollTopOffset() < 0) {sap.m.MessageBox.error("A state could not be placed there!"); return;}
				var outputState = new OutputState("toolboxOutputStateTopColor", "toolboxOutputStateBottomColor", "Output State" , this.createStateId(), this.jsPlumbInstance);
				outputState.setPositionX(State.absoluteToRelativeX(ui.position.left, 150) + GameEditor.getScrollLeftOffset()); outputState.setPositionY(State.absoluteToRelativeY(ui.position.top) + GameEditor.getScrollTopOffset());
				outputState.draw();
				this.stateList.push(outputState);
				break;
		}
	},
	
	transitionDragStop : function(event, ui) {
		document.getElementById("gameEditor--mainSplitter-content-0").style.overflow = "auto";
		document.getElementById("gameEditor--toolbox").style["overflow-x"] = "hidden";
		document.getElementById("gameEditor--toolbox").style["overflow-y"] = "auto";
		
		var connection = Transition.getClosestConnection(ui.position.left, ui.position.top, this.jsPlumbInstance);
		if(connection != null) {
			var inputTransition = new InputTransition("transition", connection, this.createTransitionId(), this);
			this.transitionList.push(inputTransition);
		} else {
			sap.m.MessageBox.error("A transition could not be placed there!");
		}
	},
	
	connectionDropped : function(oEvent) {
//		oEvent.connection.id = this.createConnectionId();
//		var connection = new Connection(oEvent.sourceId, oEvent.targetId, oEvent.connection.id);
//		this.connectionList.push(connection);
//		connection.validate();
		var connection = new Connection(oEvent.sourceId, oEvent.targetId, this.createConnectionId());
		this.connectionList.push(connection);
		connection.validate();
		return false;
	},
	
	connectionDetached : function(oEvent) {
		for(var i = 0; i < this.connectionList.length; i++) {
			if(this.connectionList[i].connectionId == oEvent.id) {
				this.connectionList[i].detach();
				break;
			}
		}
	},
	
	createStateId : function() {
		this.gameModel.StateIdCount++;
		return this.gameModel.GameId + "_state_" + this.gameModel.StateIdCount;
	},
	
	createTransitionId : function() {
		this.gameModel.TransitionIdCount++;
		return this.gameModel.GameId + "_transition_" + this.gameModel.TransitionIdCount;
	},
	
	createConnectionId : function() {
		this.gameModel.ConnectionIdCount++;
		return this.gameModel.GameId + "_connection_" + this.gameModel.ConnectionIdCount;
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
	
	load : function() {
		
		//Open the busy dialog
		this.busy = new sap.m.BusyDialog();
		this.busy.open();
		
		$.ajax({url: ODataModel.getWebAppURL() + "/LoadGame", type: 'POST',  dataType: 'application/json', data: 'gameId=' + this.gameModel.GameId, complete: $.proxy(this.loadSuccess, this)});
	},
	
	loadSuccess(data) {
		
		var loadedData = JSON.parse(data.responseText);
		
		//Init jsPlumb
		this.initJsPlumb();
		
		//Setup the toolbox drag and drop
		this.initToolbox();
		
		//Load the states
		for(var i = 0; i < loadedData.states.length; i++) {
			switch(loadedData.states[i].stateType) {
			case "START_STATE":
				StartState.load(loadedData.states[i]);
				break;
			case "OUTPUT_STATE":
				OutputState.load(loadedData.states[i]);
				break;
			}
		}
		
		//Load the connections
		Connection.load(loadedData.connections);
		
		//Load the transitions
		for(var i = 0; i < loadedData.transitions.length; i++) {
			InputTransition.load(loadedData.transitions[i]);
		}
		
		this.busy.close();
	},

	saveGame : function() {
		
		//Open the busy dialog
		this.busy = new sap.m.BusyDialog();
		this.busy.open();

		//Update the game model
		ODataModel.getODataModel().update("/Games('" + this.gameModel.GameId + "')", this.gameModel);

		//Save the game
		this.save();
	},
	
	save : function() {
		
		//Container for all of the data to be sent
		var saveJSON = {
				game : {
					gameId : this.gameModel.GameId,
					teamCount : this.gameModel.TeamCount,
					playersPerTeam : this.gameModel.PlayersPerTeam,
					stateIdCount : this.gameModel.StateIdCount,
					visibility : this.gameModel.Visibility,
				},
				states : [],
				connections : [],
				transitions :[]
		}
		
		//Loop through and save all of the states
		for(var i = 0; i < this.stateList.length; i++) {
			saveJSON.states.push(this.stateList[i].save());
		}
		
		//Loop through and save all of the connections
		for(var i = 0; i < this.connectionList.length; i++) {
			saveJSON.connections.push(this.connectionList[i].save());
		}
		
		//Loop through all of the transition
		for(var i = 0; i < this.transitionList.length; i++) {
			saveJSON.transitions.push(this.transitionList[i].save());
		}
		
		$.ajax({url: ODataModel.getWebAppURL() + "/SaveGame", type: 'POST', dataType: 'text', data: 'saveData=' + JSON.stringify(saveJSON), success : $.proxy(this.saveSuccess, this)});
	},
	
	saveSuccess : function() {
		this.busy.close();
	},
	
	resetEditor : function() {
		for(var i = 0; i < this.stateList.length; i++) {
			this.jsPlumbInstance.remove(this.stateList[i].htmlId);
		}
		this.stateList = [];
		this.connectionList = [];
		this.transitionList = [];
		this.saveCount = null;
		this.type = null;
		
		sap.ui.getCore().byId("gameEditor--saveButton").setEnabled(true);
		sap.ui.getCore().byId("gameEditor--compileButton").setEnabled(true);
		sap.ui.getCore().byId("gameEditor--runButton").setEnabled(true);
		
		GameEditor.resetScroll();
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