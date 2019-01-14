var DebuggerWindow = {
		
	debugGameInstanceId : null,
	username : null,
	
	initParams : function(debugGameInstanceId, username) {
		this.debugGameInstanceId = debugGameInstanceId;
		this.username = username;
	},
	
	initDebugger : function() {
		Index.loadJQuery();
		Index.loadExternalResources();
		var app = new sap.m.App({id:"debuggerApp", initialPage:"virtualDevice"});
		var page = sap.ui.view({id:"virtualDevice", viewName:"wlcpfrontend.views.VirtualDevice", type:sap.ui.core.mvc.ViewType.XML});
		page.getController().debugMode = true;
		page.getController().initVirtualDevice(this.debugGameInstanceId, this.username);
		app.addPage(page);
		app.placeAt("content");
	}
}