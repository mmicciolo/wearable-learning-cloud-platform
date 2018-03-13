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

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.Games
*/
//	onInit: function() {
//
//	},

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