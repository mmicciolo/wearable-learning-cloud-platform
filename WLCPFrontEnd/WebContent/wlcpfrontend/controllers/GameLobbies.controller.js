sap.ui.controller("wlcpfrontend.controllers.GameLobbies", {
	
	dialog : null,
	
	edit : null,
	
	CreateGameLobbyObject : function() {
		return {
			GameLobbyId : 0,
			GameLobbyName : "",
			UsernameDetails1 : {
				__metadata: {
		             uri : "http://localhost:8080/WLCPWebApp/WLCPOData.svc/Usernames('" + sap.ui.getCore().getModel("user").oData.username + "')"
		         }
			}
		}
	},
	
	onCreateGameLobby : function(oEvent) {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameLobbies.CreateGameLobby", this);
		
		//Create a new student
		this.edit = this.CreateGameLobbyObject();
		
		//Set the model
		this.dialog.setModel(new sap.ui.model.json.JSONModel(this.edit));
		
		//Open the dialog
		this.getView().addDependent(this.dialog);
		this.dialog.open();
	},
	
	onCreate : function(oEvent) {
		sap.ui.getCore().getModel("odata").create("/GameLobbys", oEvent.getSource().getModel().getData(), {success : this.createSuccess, error: this.createError});
		this.dialog.close();
		this.getView().removeDependent(this.dialog);
	},
	
	createSuccess : function(oSuccess) {
		sap.m.MessageToast.show("Game Lobby Created!");
	},
	
	createError : function(oError) {
		sap.m.MessageBox.error("Could not create lobby!");
	},
	
	onEdit : function() {
		var oTileContainer = this.getView().byId("gameLobbyTileContainer");
		var newValue = !oTileContainer.getEditable();
		oTileContainer.setEditable(newValue);
	},
	
	onDelete : function(oEvent) {
		this.tileToRemove = oEvent.getParameter("tile");
		sap.m.MessageBox.confirm("Are you sure you want to delete this game?", {onClose : $.proxy(this.onDeleteConfirm, this)});
	},
	
	onDeleteConfirm : function(oAction) {
		if(oAction == sap.m.MessageBox.Action.OK) {
			var path = this.tileToRemove.oBindingContexts.odata.sPath;
			var finalPath = "/Usernames('" + sap.ui.getCore().getModel("user").oData.username + "')/$links/GameLobbyDetails(" + ODataModel.getODataModel().getProperty(path).GameLobbyId + ")";
			sap.ui.getCore().getModel("odata").remove(finalPath, {success : $.proxy(this.usernameUnlinked, this), error: this.deleteError});
		}
	},
	
	usernameUnlinked : function() {
		ODataModel.getODataModel().refresh();
		var path = this.tileToRemove.oBindingContexts.odata.sPath;
		sap.ui.getCore().getModel("odata").remove(path, {success : $.proxy(this.deleteSuccess, this), error: this.deleteError});
	},
	
	deleteSuccess : function () {
		ODataModel.getODataModel().refresh();
		sap.m.MessageToast.show("Game Lobby Deleted!");
	},
	
	deleteError : function() {
		sap.m.MessageBox.error("Could not delete lobby!");
	},
	
	onCancel : function(oEvent) {
		
		//Close the dialog
		this.getView().removeDependent(this.dialog);
		this.dialog.close();
	},
	
	onSearch : function(oEvent) {
		var view = this.getView();
	    var tileContainer = view.byId("gameLobbyTileContainer");
	    var searchString = view.byId("searchField").getValue();
	    var filter = new sap.ui.model.Filter("GameLobbyName", sap.ui.model.FilterOperator.Contains, searchString);
	    tileContainer.getBinding("tiles").filter([filter], sap.ui.model.FilterType.Application);
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.GameLobby
*/
	onInit: function() {
		
		this.getView().byId("gameLobbyTileContainer").addEventDelegate({
			  onAfterRendering: function(){
			        var oBinding = this.getView().byId("gameLobbyTileContainer").getBinding("tiles");
			        oBinding.filter([new sap.ui.model.Filter("Username", "EQ", sap.ui.getCore().getModel("user").oData.username)]);
			  }
			}, this);

	},
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.GameLobby
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.GameLobby
*/
//	onAfterRendering: function() {
//		
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.GameLobby
*/
//	onExit: function() {
//
//	}

});