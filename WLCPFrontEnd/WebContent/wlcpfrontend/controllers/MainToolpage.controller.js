sap.ui.controller("wlcpfrontend.controllers.MainToolpage", {
	
	model : new sap.ui.model.json.JSONModel(),
	data : {
		navigation: [{
			title: "Dashboard",
			icon: "sap-icon://bbyd-dashboard",
			key: "wlcpfrontend.views.Dashboard,dashboard",
		},  {
			title : "Classes",
			icon : "sap-icon://chalkboard",
			key: "wlcpfrontend.views.Classes,classes",
			expanded : false,
			items : [
				{
					title : "Create Class"
				}, {
					title : "Manage Classes"
				}
			]
		}, {
			title : "Games",
			icon : "sap-icon://iphone",
			expanded : false,
			items : [
				{
					title : "Create Game"
				}, {
					title : "Manage Games"
				}, {
					title : "Visual Game Editor"
				}, {
					title : "Game Code Editor"
				}
			]
		}, {
			title : "Game Instances",
			icon : "sap-icon://instance",
			expanded : false,
			items : [
				{
					title : "Start Game Instance"
				}
			]
		}, {
			title : "Students",
			icon : "sap-icon://course-book",
			expanded : false,
			items : [
				{
					title : "Create Student"
				}, {
					title : "Manage Students"
				}
			]
		}, {
			title : "Administrator",
			icon : "sap-icon://wrench"
		}
		],
		fixedNavigation: [{
			title: "About",
			icon: "sap-icon://hint"
		}, {
			title : "Help",
			icon : "sap-icon://sys-help"
		}]
	},
	
	/**
	 * Called when an item on the left hand navigation list is clicked on
	 * @memberOf wlcpfrontend.View
	 */
	onItemSelect : function(oEvent) {
		
		//Get the item from the event and the current view
		var item = oEvent.getParameter('item');
		var viewId = this.getView().getId();
		
		//Remove the page we are currently on
		sap.ui.getCore().byId(viewId + "--pageContainer").removePage(this.currentPage);
		
		//Split the view name from the page id
		var keySplit = item.getKey().split(',');
		
		//Store our currentview
		this.currentView = this.currentView = sap.ui.xmlview(keySplit[0]);
		//Store the page we are going to navigate to for future references
		this.currentPage = sap.ui.getCore().byId(this.currentView.getId() + "--" + keySplit[1]);
		
		//Add the page to the navigation container and go to that page
		sap.ui.getCore().byId(viewId + "--pageContainer").addPage(this.currentPage);
		sap.ui.getCore().byId(viewId + "--pageContainer").to(this.currentPage.getId());
	},
	
	/**
	 * Called when we want to collapse or expand the left hand navigation
	 * @memberOf wlcpfrontend.View
	 */
	onSideNavButtonPress : function() {
		var viewId = this.getView().getId();
		var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
		var sideExpanded = toolPage.getSideExpanded();
		toolPage.setSideExpanded(!toolPage.getSideExpanded());
	},
	
	/**
	 * Called when the user clicks on the avatar icon
	 * @memberOf wlcpfrontend.View
	 */
	handleAvatarPress : function(oEvent) {
	
		//Create and popover
		if (! this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("wlcpfrontend.fragments.UsernamePopover", this);
			this.getView().addDependent(this._oPopover);
			this._oPopover.bindElement("/ProductCollection/0");
		}

		//Delay before showing
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
			this._oPopover.openBy(oButton);
		});
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.View
*/
	onInit: function() {
		
		//Setup the data model
		this.model.setData(this.data);
		this.getView().setModel(this.model);
		
		//Load the initial view which is the dashboard
		this.currentView = sap.ui.xmlview("wlcpfrontend.views.Dashboard");
		this.currentPage = sap.ui.getCore().byId(this.currentView.getId() + "--dashboard");
		sap.ui.getCore().byId(this.getView().getId() + "--pageContainer").addPage(this.currentPage);
		sap.ui.getCore().byId(this.getView().getId() + "--pageContainer").to(this.currentPage.getId());
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.View
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.View
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.View
*/
//	onExit: function() {
//
//	}

});