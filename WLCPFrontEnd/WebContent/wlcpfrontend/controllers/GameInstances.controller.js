sap.ui.controller("wlcpfrontend.controllers.GameInstances", {

	socket : null,
	
	onStartGameInstance : function() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameInstances.StartGameInstance", this);
		
		//Set the model
		this.dialog.setModel(ODataModel.getODataModel(), "odata");
		
		//Setup an on after rendering function for filtering
		this.dialog.addEventDelegate({
			onAfterRendering : $.proxy(this.onAfterRenderingStartGameInstance, this)
		});
		
		//Open the dialog
		this.dialog.open();
	},
	
	onAfterRenderingStartGameInstance : function () {
		var gameBinding = sap.ui.getCore().byId("gameInstanceGame").getBinding("items");
		gameBinding.filter([new sap.ui.model.Filter("Username", "EQ", sap.ui.getCore().getModel("user").oData.username)]);
		gameBinding.filter([new sap.ui.model.Filter("DataLog", "EQ", false)]);
		var gameLobbyBinding = sap.ui.getCore().byId("gameInstanceGameLobby").getBinding("items");
		gameLobbyBinding.filter([new sap.ui.model.Filter("Username", "EQ", sap.ui.getCore().getModel("user").oData.username)]);
	},
	
	onCancel : function(oEvent) {
		this.dialog.close();
		this.dialog.destroy();
	},
	
	onStopGameInstance : function(oEvent) {
		this.stopInstanceId = ODataModel.getODataModel().getProperty(oEvent.getParameter("tile").oBindingContexts.odata.sPath).GameInstanceId;
		sap.m.MessageBox.confirm("Are you sure you want to stop this game instance?", {onClose : $.proxy(this.stopGameInstance, this)});
	},
	
	onEdit : function() {
		var oTileContainer = this.getView().byId("gameInstanceTileContainer");
		var newValue = !oTileContainer.getEditable();
		oTileContainer.setEditable(newValue);
	},
	
	startGameInstance : function() {
		this.busy = new sap.m.BusyDialog();
		this.busy.open();
		this.socket = new WebSocket("ws://" + ServerConfig.getServerAddress());
		this.socket.binaryType = "arraybuffer";
		this.socket.onopen = $.proxy(this.onOpen, this);
		this.socket.onmessage = $.proxy(this.onMessage, this);
	},
	
	stopGameInstance : function(oEvent) {
		this.busy = new sap.m.BusyDialog();
		this.busy.open();
		this.socket = new WebSocket("ws://" + ServerConfig.getServerAddress());
		this.socket.binaryType = "arraybuffer";
		this.socket.onopen = $.proxy(this.onOpen2, this);
		this.socket.onmessage = $.proxy(this.onMessage, this);
	},
	
	onOpen : function(event) {
		var gameId = sap.ui.getCore().byId("gameInstanceGame").getSelectedKey();
		var gameLobbyId = sap.ui.getCore().byId("gameInstanceGameLobby").getSelectedKey();
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(0);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(gameId.length);
		byteBuffer.writeString(gameId);
		if(isNaN(parseInt(gameLobbyId))) { 
			byteBuffer.writeInt(-1); 
		} else {
			byteBuffer.writeInt(parseInt(gameLobbyId));
		}
		byteBuffer.writeInt(sap.ui.getCore().getModel("user").oData.username.length);
		byteBuffer.writeString(sap.ui.getCore().getModel("user").oData.username);
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		var buffer = byteBuffer.toArrayBuffer();
		this.socket.send(buffer);
	},
	
	onOpen2 : function(event) {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.writeByte(1);
		byteBuffer.writeInt(0);
		byteBuffer.writeInt(this.stopInstanceId);
		byteBuffer.writeInt(byteBuffer.offset, 1);
		byteBuffer.flip();
		var buffer = byteBuffer.toArrayBuffer();
		this.socket.send(buffer);
	},
	
	onMessage : function(event) {
		var byteBuffer = new dcodeIO.ByteBuffer();
		byteBuffer.append(new Uint8Array(event.data));
		byteBuffer.flip();
		switch(byteBuffer.readByte()) {
		case 2:
			byteBuffer.readInt();
			this.gameStartError(byteBuffer.readInt());
			break;
		case 14:
			this.gameStartedSuccess();
			break;
		case 15:
			this.gameStoppedSuccess();
			break;
		default:
			break;
		}
	},
	
	gameStartedSuccess : function() {
		this.socket.close();
		this.onCancel();
		this.busy.close();
		ODataModel.getODataModel().refresh();
		sap.m.MessageToast.show("Game Instance Start Successfully!");
	},
	
	gameStoppedSuccess : function() {
		this.socket.close();
		this.busy.close();
		ODataModel.getODataModel().refresh();
		sap.m.MessageToast.show("Game Instance Stopped Successfully!");
	},
	
	gameStartError : function(errorCode) {
		switch(errorCode) {
		case 0:
			sap.m.MessageToast.show("Selected Game Does Not Exist!");
			break;
		case 1:
			sap.m.MessageToast.show("Selected Game Lobby Does Not Exist!");
			break;
		case 2:
			sap.m.MessageToast.show("Username Does Not Exist!");
			break;
		case 3:
			sap.m.MessageToast.show("Game Instance Has Already Been Started!");
			break;
		default:
			break;
		}
		this.socket.close();
		this.onCancel();
		this.busy.close();
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.GameInstances
*/
	onInit: function() {
		this.getView().byId("gameInstanceTileContainer").addEventDelegate({
			  onAfterRendering: function(){
			        var oBinding = this.getView().byId("gameInstanceTileContainer").getBinding("tiles");
			        oBinding.filter([new sap.ui.model.Filter("Username", "EQ", sap.ui.getCore().getModel("user").oData.username)]);
			        oBinding.filter([new sap.ui.model.Filter("DebugInstance", "EQ", false)]);
			  }
			}, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.GameInstances
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.GameInstances
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.GameInstances
*/
//	onExit: function() {
//
//	}

});