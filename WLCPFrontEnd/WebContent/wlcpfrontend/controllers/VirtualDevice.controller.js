sap.ui.controller("wlcpfrontend.controllers.VirtualDevice", {
	
	socket : null,
	username : sap.ui.getCore().getModel("user").oData.username,
	modelJSON : {
			games : [],
			teams : []
	},
	model : new sap.ui.model.json.JSONModel(this.modelJSON),
	gameInstanceId : 0,
	team : 0,
	player : 0,
	transitionHandled : false,
	
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
		
	},
	
	blueButtonPressed : function() {
		
	},
	
	blackButtonPressed : function() {
		
	},
	
	disconnectPressed : function() {
		//this.socket.close();
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
		this.socket = new WebSocket('ws://192.168.0.100:3333');
		this.socket.binaryType = "arraybuffer";
		this.socket.onopen = $.proxy(this.onOpen, this);
		this.socket.onmessage = $.proxy(this.onMessage, this);
		this.socket.onclose = $.proxy(this.onClose, this);
		this.socket.onerror = $.proxy(this.onError, this);
	},
	
	onOpen : function(event) {
		console.log("Connected");
		this.startGameInstance("servertest", 1);
		this.getActiveGameLobbies();
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
		default:
			break;
		}
	},
	
	onClose : function(event) {
		console.log("Connection closed" + event);
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
		this.transitionHandled = false;
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

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.VirtualDevice
*/
	onInit: function() {
		this.setupSocketConnect();
		sap.ui.getCore().setModel(this.model);
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