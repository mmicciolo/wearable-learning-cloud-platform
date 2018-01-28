sap.ui.controller("wlcpfrontend.controllers.VirtualDevice", {
	
	socket : null,
	username : "mmicciolo",
	
	redButtonPressed : function() {
		
	},
	
	greenButtonPressed : function() {
		
	},
	
	blueButtonPressed : function() {
		
	},
	
	blackButtonPressed : function() {
		
	},
	
	setupSocketConnect : function() {
		this.socket = new WebSocket('ws://127.0.0.1:3333');
		this.socket.binaryType = "arraybuffer";
		this.socket.onopen = $.proxy(this.onOpen, this);
		this.socket.onmessage = $.proxy(this.onMessage, this);
	},
	
	onOpen : function() {
		console.log("Connected");
		this.startGameInstance("servertest", 1);
		this.getActiveGameLobbies();
	},
	
	onMessage : function(event) {
		switch(event.data[0]) {
		case 0:
			break;
		default:
			break;
		}
	},
	
	startGameInstance : function(game, gameLobby) {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(0);
		byteBuffer.writeInt(game.length);
		byteBuffer.writeString(game);
		byteBuffer.writeInt(gameLobby);
		byteBuffer.flip();
		var buffer = byteBuffer.toArrayBuffer();
		this.socket.send(buffer);
	},
	
	getActiveGameLobbies : function() {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(3);
		byteBuffer.writeInt(this.username.length);
		byteBuffer.writeString(this.username);
		byteBuffer.writeInt(0);
		byteBuffer.flip();
		this.socket.send(byteBuffer.toArrayBuffer());
//		var array = new Uint8Array(50);
//		array[0] = 3;
//		var count = this.username.length;
//		array[1] = (count >> 24) & 0xFF;
//		array[2] = (count >> 16) & 0xFF;
//		array[3] = (count >> 8) & 0xFF;
//		array[4] = count & 0xFF;
//		var c = 0;
//		for(var i = 0; i < count; i++) {
//			array[i + 5] = this.username.charCodeAt(i);
//			c = i;
//		}
		//array[i + 1] = (0 >> 24) & 0xFF;
		//array[i + 2] = (0 >> 16) & 0xFF;
		//array[i + 3] = (0 >> 8) & 0xFF;
		//array[i + 4] = 0 & 0xFF;
		//this.socket.send(array.buffer);
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.VirtualDevice
*/
	onInit: function() {
		this.setupSocketConnect();
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
//		this.getActiveGameLobbies();
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.VirtualDevice
*/
//	onExit: function() {
//
//	}

});