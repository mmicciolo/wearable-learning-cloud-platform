sap.ui.controller("wlcpfrontend.controllers.Login", {
	
	modelData : {
		username : "",
		password : "",
		mode : "",
		items : [
			{
				key : "A",
				text : "Game Manager"
			},
			{
				key : "A",
				text : "Game Editor"
			}, 
			{
				key : "A",
				text : "Player"
			}
		]
	},
	
	model : new sap.ui.model.json.JSONModel(),
	
	userModelData : {
		username: ""
	},
	
	userModel : new sap.ui.model.json.JSONModel(),
	
	onLoginPress: function() {
		this.userModelData.username = this.modelData.username;
		this.userModel.setData(this.userModelData);
		switch(this.modelData.mode) {
		case "Game Manager": 
			var app = sap.ui.getCore().byId("app1");
			var page = sap.ui.view({id:"mainToolPage", viewName:"wlcpfrontend.views.MainToolpage", type:sap.ui.core.mvc.ViewType.XML});
			app.addPage(page);
			app.to(page.getId());
			break;
		case "Game Editor":
			var app = sap.ui.getCore().byId("app1");
			var page = sap.ui.view({id:"gameEditor", viewName:"wlcpfrontend.views.GameEditor", type:sap.ui.core.mvc.ViewType.XML});
			app.addPage(page);
			app.to(page.getId());
			break;
		case "Player":
			var app = sap.ui.getCore().byId("app1");
			var page = sap.ui.view({id:"virtualDevice", viewName:"wlcpfrontend.views.VirtualDevice", type:sap.ui.core.mvc.ViewType.XML});
			app.addPage(page);
			app.to(page.getId());
			break;
		default:
			break;
		}
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.Login
*/
	onInit: function() {
		
		//Set the data to the model
		this.model.setData(this.modelData);
		this.getView().setModel(this.model);
		
		this.userModel.setData(this.userModelData);
		sap.ui.getCore().setModel(this.userModel, "user");
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.Login
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.Login
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.Login
*/
//	onExit: function() {
//
//	}

});