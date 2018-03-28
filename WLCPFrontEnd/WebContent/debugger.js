var DebuggerWindow = {
		
	username : null,
	debugGameId : null,
	restartDebug : null,
	
	initParams : function(username, debugGameId, restartDebug) {
		this.username = username;
		this.debugGameId = debugGameId;
		this.restartDebug = restartDebug;
	},
	
	initDebugger : function() {
		//this.initParams("mmicciolo", "debug");
		Index.loadJQuery();
		Index.loadExternalResources();
		var app = new sap.m.App({id:"debuggerApp", initialPage:"virtualDevice"});
		var page = sap.ui.view({id:"virtualDevice", viewName:"wlcpfrontend.views.VirtualDevice", type:sap.ui.core.mvc.ViewType.XML});
		page.getController().debugMode = true;
		page.getController().initVirtualDevice(this.username, this.debugGameId, this.restartDebug);
		app.addPage(page);
		app.placeAt("content");
	}
}