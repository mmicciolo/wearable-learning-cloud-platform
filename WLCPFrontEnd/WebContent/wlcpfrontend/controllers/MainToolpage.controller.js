sap.ui.controller("wlcpfrontend.controllers.MainToolpage", {
	
	model : new sap.ui.model.json.JSONModel(),
	data : {
		navigation: [{
			title: "Dashboard",
			icon: "sap-icon://bbyd-dashboard",
			key: "dashboard",
		},  {
			title : "Classes",
			icon : "sap-icon://chalkboard",
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
	
	onItemSelect : function(oEvent) {
		var item = oEvent.getParameter('item');
		var viewId = this.getView().getId();
		sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
	},
	
	onSideNavButtonPress : function() {
		var viewId = this.getView().getId();
		var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
		var sideExpanded = toolPage.getSideExpanded();
		toolPage.setSideExpanded(!toolPage.getSideExpanded());
	},
	
	handleAvatarPress : function(oEvent) {
		// create popover
		if (! this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("wlcpfrontend.fragments.UsernamePopover", this);
			this.getView().addDependent(this._oPopover);
			this._oPopover.bindElement("/ProductCollection/0");
		}

		// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
			this._oPopover.openBy(oButton);
		});
//		var popover = new sap.m.Popover({
//			showHeader: true,
//			placement: sap.m.PlacementType.Bottom,
//			title: "User Info",
//			content:[
//				new sap.m.Label({
//					text : "My Label:",
//					textAlign: sap.ui.core.TextAlign.Center,
//					labelFor : new sap.m.Text({
//						text: "Hello"
//					})
//				}),
//				new sap.tnt.ToolHeader( {
//					
//				})
//			]
//		}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');
//
//		popover.openBy(event.getSource());
	},

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.View
*/
	onInit: function() {
		this.model.setData(this.data);
		this.getView().setModel(this.model);
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