var DebuggerWindow = {
		
	username : null,
	debugGameId : null,
	
	initParams : function(username, debugGameId) {
		this.username = username;
		this.debugGameId = debugGameId;
	},
	
	initDebugger : function() {
		Index.loadJQuery();
		Index.loadExternalResources();
		var app = new sap.m.App({id:"debuggerApp", initialPage:"debugger"});
		var page = sap.ui.view({id:"debugger", viewName:"wlcpfrontend.views.VirtualDevice", type:sap.ui.core.mvc.ViewType.XML});
		page.getController().debugMode = true;
		page.getController().initVirtualDevice(this.username, this.debugGameId);
		app.addPage(page);
		app.placeAt("content");
	}
}