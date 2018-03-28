sap.ui.controller("wlcpfrontend.controllers.VirtualDevice", {
	
	socket : null,
	username : "",
	modelJSON : {
			games : [],
			teams : [],
			teamPlayers : []
	},
	model : new sap.ui.model.json.JSONModel(this.modelJSON),
	gameInstanceId : 0,
	team : 0,
	player : 0,
	transitionHandled : false,
	debugMode : false,
	debugGameId : null,
	
	redButtonPressed : function() {
		if(!this.transitionHandled) {
			var byteBuffer = new dcodeIO.ByteBuffer();
			byteBuffer.writeByte(13);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(this.gameInstanceId);
			byteBuffer.writeInt(this.team);
			byteBuffer.writeInt(this.player);
			byteBuffer.writeInt(1);
			byteBuffer.writeInt(byteBuffer.offset, 1);
			byteBuffer.flip();
			this.socket.send(byteBuffer.toArrayBuffer());
			this.transitionHandled = true;
		}
	},
	
	greenButtonPressed : function() {
		if(!this.transitionHandled) {
			var byteBuffer = new dcodeIO.ByteBuffer();
			byteBuffer.writeByte(13);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(this.gameInstanceId);
			byteBuffer.writeInt(this.team);
			byteBuffer.writeInt(this.player);
			byteBuffer.writeInt(2);
			byteBuffer.writeInt(byteBuffer.offset, 1);
			byteBuffer.flip();
			this.socket.send(byteBuffer.toArrayBuffer());
			this.transitionHandled = true;
		}
	},
	
	blueButtonPressed : function() {
		if(!this.transitionHandled) {
			var byteBuffer = new dcodeIO.ByteBuffer();
			byteBuffer.writeByte(13);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(this.gameInstanceId);
			byteBuffer.writeInt(this.team);
			byteBuffer.writeInt(this.player);
			byteBuffer.writeInt(3);
			byteBuffer.writeInt(byteBuffer.offset, 1);
			byteBuffer.flip();
			this.socket.send(byteBuffer.toArrayBuffer());
			this.transitionHandled = true;
		}
	},
	
	blackButtonPressed : function() {
		if(!this.transitionHandled) {
			var byteBuffer = new dcodeIO.ByteBuffer();
			byteBuffer.writeByte(13);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(this.gameInstanceId);
			byteBuffer.writeInt(this.team);
			byteBuffer.writeInt(this.player);
			byteBuffer.writeInt(4);
			byteBuffer.writeInt(byteBuffer.offset, 1);
			byteBuffer.flip();
			this.socket.send(byteBuffer.toArrayBuffer());
			this.transitionHandled = true;
		}
	},
	
	submitButtonPressSequence : function() {
		if(!this.transitionHandled) {
			var sequences = $("#virtualDevice--colorListSortable-listUl").sortable("toArray", {attribute : "class"});
			var sequence = "";
			for(var i = 0; i < sequences.length; i++) {
				if(sequences[i].includes("Red")) {
					sequence = sequence.concat("1");
				} else if(sequences[i].includes("Green")) {
					sequence = sequence.concat("2");
				} else if(sequences[i].includes("Blue")) {
					sequence = sequence.concat("3");
				} else if(sequences[i].includes("Black")) {
					sequence = sequence.concat("4");
				}
			}
			var byteBuffer = new dcodeIO.ByteBuffer();
			byteBuffer.writeByte(16);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(this.gameInstanceId);
			byteBuffer.writeInt(this.team);
			byteBuffer.writeInt(this.player);
			byteBuffer.writeInt(sequence.length);
			byteBuffer.writeString(sequence);
			byteBuffer.writeInt(byteBuffer.offset, 1);
			byteBuffer.flip();
			this.socket.send(byteBuffer.toArrayBuffer());
			this.transitionHandled = true;
		}
		var children = $("#virtualDevice--colorListSortable-listUl").children();
		for(var i = 0; i < children.length; i++) {
			children[i].remove();
		}
	},
	
	clearButtonPressSequence : function() {
		var children = $("#virtualDevice--colorListSortable-listUl").children();
		for(var i = 0; i < children.length; i++) {
			children[i].remove();
		}
	},
	
	disconnectPressed : function() {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(8);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(this.gameInstanceId);
		byteBuffer.writeInt(this.team);
		byteBuffer.writeInt(this.player);
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
	},
	
	setupSocketConnect : function() {
		this.socket = new WebSocket("ws://" + ServerConfig.getServerAddress());
		this.socket.binaryType = "arraybuffer";
		this.socket.onopen = $.proxy(this.onOpen, this);
		this.socket.onmessage = $.proxy(this.onMessage, this);
		this.socket.onclose = $.proxy(this.onClose, this);
		this.socket.onerror = $.proxy(this.onError, this);
	},
	
	onOpen : function(event) {
		console.log("Connected");
		//this.startGameInstance("estimateit", 1);
		if(!this.debugMode) {
			this.getActiveGameLobbies();
		} else {
			this.startDebugGameInstance(this.username, this.debugGameId);
		}
	},
	
	onMessage : function(event) {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.append(new Uint8Array(event.data));
		byteBuffer.flip();
		switch(byteBuffer.readByte()) {
		case 3:
			this.handleActiveGameLobbies(byteBuffer);
			break;
		case 4:
			this.handleGameTeams(byteBuffer);
			break;
		case 6:
			this.joinedGame(byteBuffer);
			break;
		case 9:
			this.disconnectComplete();
			break;
		case 10:
			console.log("Heart Beat!");
			this.heartBeat();
			break;
		case 12:
			this.displayText(byteBuffer);
			break;
		case 13:
			this.singleButtonPress(byteBuffer);
			break;
		case 14:
			this.gameInstanceStarted(byteBuffer);
			break;
		case 16:
			this.sequenceButtonPress(byteBuffer);
			break;
		case 18:
			this.handleGameTeamsAndPlayers(byteBuffer);
			break;
		default:
			break;
		}
	},
	
	onClose : function(event) {
		console.log("Connection closed" + event);
		sap.m.MessageBox.error("The connection was closed! This may have happened if you disconnected, locked your device or the screen turned off. The page will now refresh. Please re-login to continue where you left off in the game.", { onClose : function() {
			location.reload();
		}});
	},
	
	onError : function(event) {
		console.log("Error" + event);
	},
	
	disconnectComplete : function() {
		this.socket.close();
	},
	
	heartBeat : function() {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(10);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(this.gameInstanceId);
		byteBuffer.writeInt(this.team);
		byteBuffer.writeInt(this.player);
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
	},
	
	displayText : function(byteBuffer) {
		//Switch the nav container to display text if it isnt already
		
		var displayTextBox = sap.ui.getCore().byId("virtualDevice--displayText");
		byteBuffer.readInt();
		byteBuffer.skip(12);
		var text = byteBuffer.readString(byteBuffer.readInt());
		displayTextBox.setValue(text);
	},
	
	singleButtonPress : function(byteBuffer) {
		this.switchToTransitionType("SingleButtonPress");
		this.transitionHandled = false;
	}, 
	
	sequenceButtonPress : function(byteBuffer) {
		this.switchToTransitionType("SequenceButtonPress");
		this.transitionHandled = false;
	},
	
	switchToTransitionType : function(type) {
		var navContainer = sap.ui.getCore().byId("virtualDevice--inputContainer");
		switch(type) {
		case "SingleButtonPress":
			navContainer.afterNavigate = null;
			navContainer.to(sap.ui.getCore().byId("virtualDevice--singleButtonPress"));
			break;
		case "SequenceButtonPress":
			var page = sap.ui.getCore().byId("virtualDevice--sequenceButtonPress");
			page.onAfterRendering = $.proxy(this.onAfterRenderingSequence, this);
			navContainer.to(sap.ui.getCore().byId("virtualDevice--sequenceButtonPress"));
			break;
		}
	},
	
	onAfterRenderingSequence : function() {
		$("#virtualDevice--colorListRed").draggable({revert: false, helper: "clone", connectToSortable : "#virtualDevice--colorListSortable-listUl"});
		$("#virtualDevice--colorListGreen").draggable({revert: false, helper: "clone", connectToSortable : "#virtualDevice--colorListSortable-listUl"});
		$("#virtualDevice--colorListBlue").draggable({revert: false, helper: "clone", connectToSortable : "#virtualDevice--colorListSortable-listUl"});
		$("#virtualDevice--colorListBlack").draggable({revert: false, helper: "clone", connectToSortable : "#virtualDevice--colorListSortable-listUl"});
		$("#virtualDevice--colorListSortable-listUl").sortable();
	},
	
	joinedGame : function(byteBuffer) {
		//console.log("We have joined the game!");
		//Switch pages
		var navContainer = sap.ui.getCore().byId("virtualDevice--virtualDeviceNavContainer");
		navContainer.to(sap.ui.getCore().byId("virtualDevice--virtualDevicePage"));	
		
		byteBuffer.readInt();
		this.gameInstanceId = byteBuffer.readInt();
		this.team = byteBuffer.readInt();
		this.player = byteBuffer.readInt();
		
		this.heartBeat();
	},

	handleGameTeams : function(byteBuffer) {
		byteBuffer.readInt();
		var gameInstanceId = byteBuffer.readInt();
		byteBuffer.skip(8);
		var gameLobbyId = byteBuffer.readInt();
		byteBuffer.readString(byteBuffer.readInt());
		var teams = [];
		var teamCount = byteBuffer.readInt();
		for(var i = 0; i < teamCount; i++) {
			this.modelJSON.teams.push({gameInstanceId : gameInstanceId, gameLobbyId : gameLobbyId, teamNumber : "Team " + byteBuffer.readByte()});
		}
		this.modelJSON.games = [];
		this.model.setData(this.modelJSON);
	},
	
	onTeamJoinPress : function(oEvent) {
		
		//Get the game and team to join
		var selectedGameInstance = this.model.getProperty(oEvent.getSource().getParent().getItems()[1].getSelectedItem().getBindingContext().getPath());
		
		//Send a request to connect
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(5);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(selectedGameInstance.gameInstanceId);
		//byteBuffer.skip(8);
		byteBuffer.writeInt(0); byteBuffer.writeInt(0);
		byteBuffer.writeInt(this.username.length);
		byteBuffer.writeString(this.username);
		byteBuffer.writeInt(selectedGameInstance.gameLobbyId);
		byteBuffer.writeByte(parseInt(selectedGameInstance.teamNumber.replace("Team ", "")));
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
	},

	handleActiveGameLobbies : function(byteBuffer) {
		byteBuffer.readInt();
		byteBuffer.skip(byteBuffer.readInt());
		var lobbyCount = byteBuffer.readInt();
		var lobbies = [];
		for(var i = 0; i < lobbyCount; i++) {
			var stringLength = byteBuffer.readInt();
			var gameName = "";
			for(var n = 0; n < stringLength; n++) {
				gameName += String.fromCharCode(byteBuffer.readByte());
			}
			stringLength = byteBuffer.readInt();
			var gameLobbyName = "";
			for(var n = 0; n < stringLength; n++) {
				gameLobbyName += String.fromCharCode(byteBuffer.readByte());
			}
			var gameLobbyId = byteBuffer.readInt();
			var gameInstanceId = byteBuffer.readInt();
			this.modelJSON.games.push({gameName : gameName, gameLobbyName : gameLobbyName, gameLobbyId : gameLobbyId, gameInstanceId : gameInstanceId});
		}
		this.model.setData(this.modelJSON);
	},
	
	onLoginPress : function(oEvent) {
		
		//Get the selected lobby
		var selectedLobby = this.model.getProperty(oEvent.getSource().getParent().getItems()[1].getSelectedItem().getBindingContext().getPath());
		
		//Switch pages
		var navContainer = sap.ui.getCore().byId("virtualDevice--virtualDeviceNavContainer");
		navContainer.to(sap.ui.getCore().byId("virtualDevice--selectTeam"));
		
		//Send a request for the avaliable teams for the given game lobby id
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(4);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(parseInt(selectedLobby.gameInstanceId));
		//byteBuffer.skip(8);
		for(var i = 0; i < 8; i++) {
			byteBuffer.writeByte(0);
		}
		byteBuffer.writeInt(parseInt(selectedLobby.gameLobbyId));
		byteBuffer.writeInt(parseInt(this.username.length));
		byteBuffer.writeString(this.username);
		//byteBuffer.skip(4);
		for(var i = 0; i < 4; i++) {
			byteBuffer.writeByte(0);
		}
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
	},
	
	startGameInstance : function(game, gameLobby) {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(0);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(game.length);
		byteBuffer.writeString(game);
		byteBuffer.writeInt(gameLobby);
		byteBuffer.writeInt(this.username.length);
		byteBuffer.writeString(this.username);
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		var buffer = byteBuffer.toArrayBuffer();
		this.socket.send(buffer);
	},
	
	getActiveGameLobbies : function() {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(3);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(this.username.length);
		byteBuffer.writeString(this.username);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
	},
	
	startDebugGameInstance : function(username, debugGameId) {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(17);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(this.debugGameId.length);
		byteBuffer.writeString(this.debugGameId);
		byteBuffer.writeInt(this.username.length);
		byteBuffer.writeString(this.username);
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
	},
	
	gameInstanceStarted : function(byteBuffer) {
		if(!this.debugMode) {
			
		} else {
			byteBuffer.readInt();
			this.gameInstanceId = byteBuffer.readInt();
			//Request the teams and players
			var byteBuffer = new dcodeIO.ByteBuffer();
			byteBuffer.writeByte(18);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(this.gameInstanceId);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(0);
			byteBuffer.writeInt(byteBuffer.offset, 1);
			byteBuffer.flip();
			this.socket.send(byteBuffer.toArrayBuffer());
		}
	},
	
	handleGameTeamsAndPlayers : function(byteBuffer) {
		byteBuffer.readInt();
		var gameInstanceId = byteBuffer.readInt();
		byteBuffer.skip(8);
		var teams = [];
		var teamCount = byteBuffer.readInt();
		for(var i = 0; i < teamCount; i = i + 2) {
			var team = byteBuffer.readByte();
			var player = byteBuffer.readByte();
			this.modelJSON.teamPlayers.push({team : team, player : player, teamPlayer : "Team " + (team + 1) + " Player " + (player + 1)});
		}
		this.modelJSON.games = [];
		this.model.setData(this.modelJSON);
	},
	
	onDebugJoinPress : function(oEvent) {
		
		var selectedTeamPlayer = this.model.getProperty(oEvent.getSource().getParent().getItems()[1].getSelectedItem().getBindingContext().getPath());
		
		//Send a request to connect
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(19);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(this.gameInstanceId);
		byteBuffer.writeInt(parseInt(selectedTeamPlayer.team));
		byteBuffer.writeInt(parseInt(selectedTeamPlayer.player));
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
	},
	
	initVirtualDevice : function(username, debugGameId) {
		if(!this.debugMode) {
			this.username = sap.ui.getCore().getModel("user").oData.username;
			this.setupSocketConnect();
			sap.ui.getCore().setModel(this.model);
		} else {
			this.username = username;
			this.debugGameId = debugGameId;
			this.setupSocketConnect();
			sap.ui.getCore().setModel(this.model);
		}
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.VirtualDevice
*/
	onInit: function() {
		this.getView().addEventDelegate({
			  onAfterRendering: function(){
				  if(!this.debugMode) {
						var navContainer = sap.ui.getCore().byId("virtualDevice--virtualDeviceNavContainer");
						navContainer.to(sap.ui.getCore().byId("virtualDevice--selectGameLobby"));	
				  } else {
						var navContainer = sap.ui.getCore().byId("virtualDevice--virtualDeviceNavContainer");
						navContainer.to(sap.ui.getCore().byId("virtualDevice--selectTeamPlayer"));
				  }
			  }
		}, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.VirtualDevice
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.VirtualDevice
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.VirtualDevice
*/
//	onExit: function() {
//
//	}

});