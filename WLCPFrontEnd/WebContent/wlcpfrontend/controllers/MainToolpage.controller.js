sap.ui.controller("wlcpfrontend.controllers.MainToolpage", {
	
	model : new sap.ui.model.json.JSONModel(),
	
	/**
	 * Current item selected in the navigation
	 */
	currentItem : null,
	
	/**
	 * Current view being display in the navigation container
	 */
	currentView : null,
	
	/**
	 * Current page being display in the navigation container
	 */
	currentPage : null,
	
	/**
	 * Called when a parent item on the left hand navigation list is clicked on
	 * @memberOf wlcpfrontend.View
	 */
	selectParentItem2 : function(oEvent) {
		
		//Get the item from the event and the current view
		var item = oEvent.getParameter('item');
		var viewId = this.getView().getId();
		
		//Remove the page we are currently on
		sap.ui.getCore().byId(viewId + "--pageContainer").removePage(this.currentPage);
		
		//Unexpand the item
		if(this.currentItem != null) {
			this.currentItem.setExpanded(false);
		}
		
		//Split the view name from the page id
		var keySplit = item.getKey().split(',');
		
		//Store our current item
		this.currentItem = item;
		
		//Store our current view
		this.currentView = sap.ui.xmlview(keySplit[0]);
		
		//Store the page we are going to navigate to for future references
		this.currentPage = sap.ui.getCore().byId(this.currentView.getId() + "--" + keySplit[1]);
		
		//Set the item to be expanded
		item.setExpanded(true);
		
		//Add the page to the navigation container and go to that page
		sap.ui.getCore().byId(viewId + "--pageContainer").addPage(this.currentPage);
		sap.ui.getCore().byId(viewId + "--pageContainer").to(this.currentPage.getId());
	},
	
	selectParentItem : function (oEvent) {
		
		//Get the item from the event
		var item = oEvent.getParameter('item');
		var viewId = this.getView().getId();
		
		//Split the item type and view name from the page id
		var keySplit = item.getKey().split(',');
		
		//Switch based off of the type of thing we want to display
		switch(keySplit[3]) {
		case "page":
			this.goToPage(item, viewId, keySplit[0], keySplit[1], keySplit[2]);
			break;
		case "popup":
			this.goToPage(item, viewId, keySplit[0], keySplit[4], keySplit[5]);
			//var fragment = sap.ui.xmlfragment("wlcpfrontend.fragments.CreateClass");
			//this.getView().addDependent(fragment);
			//fragment.open();
			var view = sap.ui.xmlview(keySplit[1]);
			this.getView().addDependent(view);
			view.open();
			
			break;
		default:
		}
	},
	
	goToPage : function(item, viewId, hierarchyType, viewName, pageName) {
		
		//If we are trying to switch to the view we are already on, ignore the request
		if(viewName == this.currentView.sViewName) {
			return;
		}
		
		//If its a parent page
		if(hierarchyType == "parent") {
			
			//Unexpand the old item
			if(this.currentItem != null) {
				this.currentItem.setExpanded(false);
			}
			
			//Expand the new item
			item.setExpanded(true);
			
			//Store the item
			this.currentItem = item;
		}
		
		//Create and Store our current view
		this.currentView = sap.ui.xmlview(viewName);
		
		//Store the page we are going to navigate to for future references
		this.currentPage = sap.ui.getCore().byId(this.currentView.getId() + "--" + pageName);
		
		//Add the page to the navigation container and go to that page
		sap.ui.getCore().byId(viewId + "--pageContainer").addPage(this.currentPage);
		sap.ui.getCore().byId(viewId + "--pageContainer").to(this.currentPage.getId());
	},
	
	
	/**
	 * Called when a child item of the navigation list is selected
	 * @memberOf wlcpfrontend.View
	 */
	selectChildItem : function(oEvent) {
		
		//Get the item from the event and the current view
		//var item = oEvent.getParameter('item');
		
		//this.selectParentItem(oEvent);
		
		this.one = sap.ui.xmlview("wlcpfrontend.views.Classes");
		this.two = sap.ui.xmlview("wlcpfrontend.views.Classes");
		this.one.destroy(true);
		
		//Does the parent view already exist?
		console.log("child");
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
		//this.model.setData(this.data);
		this.model.loadData("wlcpfrontend/model/Dashboard.json");
		this.getView().setModel(this.model);
		
		//Load the initial view which is the dashboard
		this.currentView = sap.ui.xmlview("wlcpfrontend.views.Dashboard");
		this.currentPage = sap.ui.getCore().byId(this.currentView.getId() + "--dashboard");
		sap.ui.getCore().byId(this.getView().getId() + "--pageContainer").addPage(this.currentPage);
		sap.ui.getCore().byId(this.getView().getId() + "--pageContainer").to(this.currentPage.getId());
		
		//Load the main data model
		if(window.location.href.includes("localhost")) {
			this.oModel = new sap.ui.model.odata.v2.ODataModel("http://localhost:8080/WLCPWebApp/WLCPOData.svc");
		} else {
			this.oModel = new sap.ui.model.odata.v2.ODataModel("http://24.240.135.66:8080/WLCPWebApp/WLCPOData.svc");
		}
		sap.ui.getCore().setModel(this.oModel, "odata");
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