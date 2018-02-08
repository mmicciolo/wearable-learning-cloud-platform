var Index = {
	
	showMainPage : true,
	
	main : function() {
		this.loadJQuery();
		this.loadExternalResources();
		this.loadPage();
	},
	
	loadJQuery : function() {
	    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
	    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
	    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
	    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
	    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
		jQuery.sap.require("sap.m.MessageBox");
	},
	
	
	loadExternalResources : function() {
		
		sap.ui.localResources("wlcpfrontend");
		
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/state/State");
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/state/StartState");
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/state/OutputState");
		
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/transition/Transition");
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/transition/InputTransition");
	
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/connection/Connection");
		
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/validation/ValidationRule");
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/validation/ConnectionValidationRules");
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/validation/StateValidationRules");
		
		jQuery.sap.require("wlcpfrontend/javascript/GameEditor/GameEditor");
		jQuery.sap.require("wlcpfrontend/javascript/ODataModel");
		
		jQuery.sap.require("wlcpfrontend/javascript/jsplumb");
		jQuery.sap.require("wlcpfrontend/javascript/jquery-ui-touch-punch-min");
		jQuery.sap.require("wlcpfrontend/javascript/path-data-polyfill");
		jQuery.sap.require("wlcpfrontend/javascript/bytebuffer");
		
		jQuery.sap.includeStyleSheet("wlcpfrontend/css/Login.css");
		jQuery.sap.includeStyleSheet("wlcpfrontend/css/GameEditor.css");
		jQuery.sap.includeStyleSheet("wlcpfrontend/css/VirtualDevice.css");
	},
	
	loadPage : function() {
		var app;
		if(this.showMainPage) {
			app = new sap.m.App({id:"app1", initialPage:"idView1"});
			var page = sap.ui.view({id:"idView1", viewName:"wlcpfrontend.views.Login", type:sap.ui.core.mvc.ViewType.XML});
			page.addStyleClass("myBackgroundStyle");
		} else {
			app = new sap.m.App({id:"app1", initialPage:"gameEditor"});
			var page = sap.ui.view({id:"gameEditor", viewName:"wlcpfrontend.views.GameEditor", type:sap.ui.core.mvc.ViewType.XML});
		}
		//app = new sap.m.App({id:"app1", initialPage:"virtualDevice"});
		//var page = sap.ui.view({id:"virtualDevice", viewName:"wlcpfrontend.views.VirtualDevice", type:sap.ui.core.mvc.ViewType.XML});
		app.addPage(page);
		app.placeAt("content");
	},
}