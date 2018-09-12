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
	            uri : ODataModel.getODataModelURL() + "/Usernames('" + sap.ui.getCore().getModel("user").oData.username + "')"
				//uri : ODataModel.getODataModelURL() + "/Usernames('mmicciolo')"
	         }
		},
		Visibility : true,
		DataLog : false
	},
	
	gameModel : {
		GameId : "",
		TeamCount : 0,
		PlayersPerTeam : 0,
		StateIdCount : 0,
		TransitionIdCount : 0,
		ConnectionIdCount : 0,
		Visibility : true,
		DataLog : false
	},
	
	stateList : [],
	transitionList : [],
	connectionList : [],
	
	jsPlumbInstance : null,
	
	loadFromEditor : null,
	
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
				DataLogger.logGameEditor();
				break;
		}
	},
	
	transitionDragStop : function(event, ui) {
		document.getElementById("gameEditor--mainSplitter-content-0").style.overflow = "auto";
		document.getElementById("gameEditor--toolbox").style["overflow-x"] = "hidden";
		document.getElementById("gameEditor--toolbox").style["overflow-y"] = "auto";
		
		var connection = Transition.getClosestConnection(ui.position.left, ui.position.top, this.jsPlumbInstance);
		
		if(connection != null) {
			for(var i = 0; i < GameEditor.getEditorController().connectionList.length; i++) {
				if(GameEditor.getEditorController().connectionList[i].connectionId == connection.id) {
					connection = GameEditor.getEditorController().connectionList[i];
					break;
				}
			}
			var inputTransition = new InputTransition("transition", connection, this.createTransitionId(), this);
			inputTransition.connection.transition = inputTransition;
			this.transitionList.push(inputTransition);
			for(var i = 0; i < this.connectionList.length; i++) {
				if(this.connectionList[i].connectionId == connection.id) {
					this.connectionList[i].transition = inputTransition;
					inputTransition.connection = this.connectionList[i];
					break;
				}
			}
			inputTransition.onChange(connection);
			for(var i = 0; i < this.stateList.length; i++) {
				if(this.stateList[i].htmlId == connection.targetId) {
					this.stateList[i].onChange();
				}
			}
			DataLogger.logGameEditor();
		} else {
			sap.m.MessageBox.error("A transition could not be placed there!");
		}
	},
	
	connectionDropped : function(oEvent) {
		//Check to see if the state has an input transition
		if(GameEditor.getJsPlumbInstance().getConnections({target : oEvent.sourceId}).length == 0 && !oEvent.sourceId.includes("start")) {
			sap.m.MessageBox.error("You cannot have any output connections without input connections.");
			return false;
		}
		//Check to see if the connection already exists
		//Or if they are trying to add a second of the same source and target
		//This can probably be moved to a validator eventually
		for(var i = 0; i < this.connectionList.length; i++) {
			if(oEvent.connection.id == this.connectionList[i].connectionId) {
				return false;
			} else if(oEvent.sourceId == this.connectionList[i].connectionFrom.htmlId && oEvent.targetId == this.connectionList[i].connectionTo.htmlId) {
				sap.m.MessageBox.error("You cannot have mutliple connections with same source and target state!");
				return false;
			}
		}
		
		//Else we need to create a new one
		var connection = new Connection( this.createConnectionId(), oEvent.sourceId, oEvent.targetId);
		this.connectionList.push(connection);
		connection.validate();
		return false;
	},
	
	connectionDetached : function(oEvent) {
		var i = 0;
		if(oEvent.suspendedElementId == oEvent.targetId || typeof oEvent.suspendedElementId === "undefined") {
			for(var i = 0; i < this.connectionList.length; i++) {
			if(this.connectionList[i].connectionId == oEvent.id) {
				this.connectionList[i].detach();
				DataLogger.logGameEditor();
				break;
				}
			}
		} else {
			sap.m.MessageBox.error("Cannot move connections, drag a new one.");
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
		fragment.addEventDelegate({
			  onAfterRendering: function(){
			        var oBinding = sap.ui.getCore().byId("loadGameComboBox").getBinding("items");
			        var filter = new sap.ui.model.Filter({
			        	filters : [new sap.ui.model.Filter("Username", "EQ", sap.ui.getCore().getModel("user").oData.username),
			        			   new sap.ui.model.Filter("Visibility", "EQ", true)],
			        	and : false
			        });
			        oBinding.filter(filter);
			        oBinding.filter([new sap.ui.model.Filter("DataLog", "EQ", false)]);
			  }
			}, this);
		fragment.open();
	},
	
	load : function() {
		
		//Open the busy dialog
		this.busy = new sap.m.BusyDialog();
		this.busy.open();
		
		$.ajax({url: ODataModel.getWebAppURL() + "/LoadGame", type: 'POST',  dataType: 'text', data: 'gameId=' + this.gameModel.GameId, success: $.proxy(this.loadSuccess, this), error : $.proxy(this.loadError, this)});
	},
	
	loadFromManager : function(gameInfo) {
		GameEditor.getEditorController().resetEditor();
		GameEditor.getEditorController().gameModel.GameId = gameInfo.GameId;
		GameEditor.getEditorController().gameModel.TeamCount = gameInfo.TeamCount;
		GameEditor.getEditorController().gameModel.PlayersPerTeam = gameInfo.PlayersPerTeam;
		GameEditor.getEditorController().gameModel.Visibility = gameInfo.Visibility;
		GameEditor.getEditorController().gameModel.StateIdCount = gameInfo.StateIdCount;
		GameEditor.getEditorController().gameModel.TransitionIdCount = gameInfo.TransitionIdCount;
		GameEditor.getEditorController().gameModel.ConnectionIdCount = gameInfo.ConnectionIdCount;
		GameEditor.getEditorController().load();
	},
	
	loadSuccess(data) {
		
		//var loadedData = JSON.parse(data.responseText);
		var loadedData = JSON.parse(data);
		
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
		
		//Load state connections
		for(var i = 0; i < loadedData.states.length; i++) {
			for(var n = 0; n < this.stateList.length; n++) {
				if(loadedData.states[i].stateId == this.stateList[n].htmlId) {
					for(var j = 0; j < loadedData.states[i].inputConnections.length; j++) {
						for(var l = 0; l < this.connectionList.length; l++) {
							if(loadedData.states[i].inputConnections[j].connectionId == this.connectionList[l].connectionId) {
								this.stateList[n].inputConnections.push(this.connectionList[l]);
								this.connectionList[l].connectionTo = this.stateList[n];
							}
						}
					}
					for(var j = 0; j < loadedData.states[i].outputConnections.length; j++) {
						for(var l = 0; l < this.connectionList.length; l++) {
							if(loadedData.states[i].outputConnections[j].connectionId == this.connectionList[l].connectionId) {
								this.stateList[n].outputConnections.push(this.connectionList[l]);
								this.connectionList[l].connectionFrom = this.stateList[n];
							}
						}
					}
				}
			}
		}
		
		//Load connection transition
		for(var i = 0; i < loadedData.connections.length; i++) {
			if(typeof loadedData.connections[i].transition !== "undefined") {
				for(var n = 0; n < this.connectionList.length; n++) {
					if(this.connectionList[n].connectionId == loadedData.connections[i].connectionId) {
						for(var j = 0; j < this.transitionList.length; j++) {
							if(this.transitionList[j].overlayId == loadedData.connections[i].transition.transitionId) {
								this.connectionList[n].transition = this.transitionList[j];
							}
						}
					}
				}
			}
		}
		
		//Load transition connection
		for(var i = 0; i < loadedData.transitions.length; i++) {
			if(typeof loadedData.transitions[i].connection !== "undefined") {
				for(var n = 0; n < this.transitionList.length; n++) {
					if(this.transitionList[n].overlayId == loadedData.transitions[n].transitionId) {
						for(var j = 0; j < this.connectionList.length; j++) {
							if(this.connectionList[j].connectionId == loadedData.transitions[n].connection.connectionId) {
								this.transitionList[n].connection = this.connectionList[j];
							}
						}
					}
				}
			}
		}
		
		//Have the transitions revalidate
		for(var i = 0; i < this.transitionList.length; i++) {
			this.transitionList[i].onChange();
		}
		
		//Have the states revalidate
		for(var i = 0; i < this.stateList.length; i++) {
			this.stateList[i].onChange();
		}

		this.busy.close();
	},
	
	loadError : function() {
		sap.m.MessageBox.error("There was an error loading the game!");
		this.busy.close();
	},

	saveGame : function() {
		
		//This is a save without a run
		this.saveRun = false;
		
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
		
		var seen = [];
		var stringify = JSON.stringify(saveJSON, function(key, val) {
			   if (val != null && typeof val == "object") {
			        if (seen.indexOf(val) >= 0) {
			            return;
			        }
			        seen.push(val);
			    }
			    return val;
			});
		
		$.ajax({url: ODataModel.getWebAppURL() + "/SaveGame", type: 'POST', dataType: 'text', data: 'saveData=' + JSON.stringify(saveJSON), success : $.proxy(this.saveSuccess, this), error : $.proxy(this.saveError, this)});
	},
	
	saveSuccess : function() {
		if(!this.saveRun) {
			this.busy.close();
		} else {
			this.run();
		}
	},
	
	saveError : function() {
		this.busy.close();
		sap.m.MessageBox.error("There was an error saving the game!");
	},
	
	runGame : function() {
		this.saveRun = true;
		this.save();
	},
	
	run : function() {
		//Open the busy dialog
		this.busy = new sap.m.BusyDialog();
		this.busy.open();
		$.ajax({url: ODataModel.getWebAppURL() + "/Transpile", type: 'POST', dataType: 'text', data: 'gameId=' + this.gameModel.GameId, success : $.proxy(this.runSuccess, this), error : $.proxy(this.runError, this)});
	},
	
	runSuccess : function() {
		this.busy.close();
		sap.m.MessageToast.show("Transpiled Successfully! Opening Debugger!");
		var filters = [];
		filters.push(new sap.ui.model.Filter({path: "Username", operator: sap.ui.model.FilterOperator.EQ, value1: sap.ui.getCore().getModel("user").oData.username}));
		filters.push(new sap.ui.model.Filter({path: "DebugInstance", operator: sap.ui.model.FilterOperator.EQ, value1: true}));
		ODataModel.getODataModel().read("/GameInstances", {filters : filters, success : $.proxy(this.readInstancesSuccess, this), error: $.proxy(this.readInstancesError, this)});
		//this.openDebuggerWindow();
		//debuggerWindow.DebuggerWindow.initParams(sap.ui.getCore().getModel("user").oData.username, this.gameModel.GameId);
	},
	
	runError : function() {
		sap.m.MessageBox.error("There was an error running...");
		this.busy.close();
	},
	
	readInstancesSuccess : function(oData) {
		if(oData.results.length == 0) {
			this.restartDebug = false;
			this.openDebuggerWindow();
		} else {
			if(oData.results[0].Game == this.gameModel.GameId) {
				sap.m.MessageBox.confirm("You are already debugging a game instance. Do you want to restart the instance (OK) or open another debugger (CANCEL) (to continue debugging the current game with another user)?", {onClose : $.proxy(this.handleDebugInstanceMessageBox, this)});
			} else {
				this.restartDebug = true;
				this.openDebuggerWindow();
			}
		}
	},
		
	readInstancesError : function() {
		sap.m.MessageBox.error("There was an error debugging...");
	},
	
	handleDebugInstanceMessageBox : function(oAction) {
		if(oAction == sap.m.MessageBox.Action.OK) {
			this.restartDebug = true;
		} else {
			this.restartDebug = false;
		}
		this.openDebuggerWindow();
	},
	
	openDebuggerWindow : function() {
		this.debuggerWindow = window.open(window.location.href + "debugger.html");
		this.debuggerWindow.addEventListener('load', $.proxy(this.debuggerWindowOpened, this), true); 
	},
	
	debuggerWindowOpened : function() {
		this.debuggerWindow.DebuggerWindow.initParams(sap.ui.getCore().getModel("user").oData.username, this.gameModel.GameId, this.restartDebug);
		this.debuggerWindow.DebuggerWindow.initDebugger();
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
		//sap.ui.getCore().byId("gameEditor--compileButton").setEnabled(true);
		sap.ui.getCore().byId("gameEditor--runButton").setEnabled(true);
		
		GameEditor.resetScroll();
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.GameEditor
*/
	onInit: function() {
		
		window.onbeforeunload = function() {
			return "Are you sure you want to leave this page? You will lose all unsaved data!";
		};
		
		GameEditor.getEditor().addEventDelegate({
			  onAfterRendering: function(){
				  
				  //Load the data model
				  ODataModel.setupODataModel();
				  
				  //Check to see if we are loading from the game manager
				  if(this.loadFromEditor != null) {
					  this.loadFromManager(this.loadFromEditor);
				  }
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