sap.ui.controller("wlcpfrontend.controllers.Games", {
	
	
	onEdit : function() {
		var oTileContainer = this.getView().byId("gamesTileContainer");
		var newValue = !oTileContainer.getEditable();
		oTileContainer.setEditable(newValue);
	},
	
	onDelete : function(oEvent) {
		this.tileToRemove = oEvent.getParameter("tile");
		this.tileContainer = oEvent.getSource();
		this.onDeleteEvent = oEvent;
		sap.m.MessageBox.confirm("Are you sure you want to delete this game?", {onClose : $.proxy(this.onDeleteConfirm, this)});
	},
	
	onDeleteConfirm : function(oAction) {
		if(oAction == sap.m.MessageBox.Action.OK) {
			this.tileContainer.removeTile(this.tileToRemove);
		}
	},
	
	onSearch : function(oEvent) {
		var view = this.getView();
	    var tileContainer = view.byId("gamesTileContainer");
	    var searchString = view.byId("searchField").getValue();
	    var filter = new sap.ui.model.Filter("GameId", sap.ui.model.FilterOperator.Contains, searchString);
	    tileContainer.getBinding("tiles").filter([filter], sap.ui.model.FilterType.Application);
	},
	
	onTilePress : function(oEvent) {
		this.gameToOpen = ODataModel.getODataModel().getProperty(oEvent.getSource().getBindingContext("odata").sPath);
		sap.m.MessageBox.confirm("Do you want to open this game in the editor?", {onClose: $.proxy(this.onConfirmGameOpen, this)});
	},
	
	onConfirmGameOpen : function(oAction) {
		if(oAction == sap.m.MessageBox.Action.OK) {
			var app = sap.ui.getCore().byId("app1");
			var page = sap.ui.view({id:"gameEditor", viewName:"wlcpfrontend.views.GameEditor", type:sap.ui.core.mvc.ViewType.XML});
			page.getController().loadFromEditor = this.gameToOpen;
			app.addPage(page);
			app.to(page.getId());
		}
	},
	
	onDelete : function(oEvent) {
		this.tileToRemove = oEvent.getParameter("tile");
		sap.m.MessageBox.confirm("Are you sure you want to delete this game?", {onClose : $.proxy(this.onDeleteConfirm, this)});
	},
	
	onDeleteConfirm : function(oAction) {
		if(oAction == sap.m.MessageBox.Action.OK) {
			var gameInfo = ODataModel.getODataModel().getProperty(this.tileToRemove.getBindingContext("odata").sPath);
			$.ajax({url: ODataModel.getWebAppURL() + "/DeleteGame", type: 'POST', dataType: 'text', data: 'gameId=' + gameInfo.GameId, success : $.proxy(this.deleteSuccess, this), error : $.proxy(this.deleteError, this)});
		}
	},
	
	deleteSuccess : function() {
		ODataModel.getODataModel().refresh();
		sap.m.MessageToast.show("Game deleted!");
	},
	
	deleteError : function() {
		sap.m.MessageToast.show("Game could not be deleted!");
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.Games
*/
	onInit: function() {
		this.getView().byId("gamesTileContainer").addEventDelegate({
			  onAfterRendering: function(){
			        var oBinding = this.getView().byId("gamesTileContainer").getBinding("tiles");
			        oBinding.filter([new sap.ui.model.Filter("Username", "EQ", sap.ui.getCore().getModel("user").oData.username)]);
			  }
			}, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.Games
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.Games
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.Games
*/
//	onExit: function() {
//
//	}

});