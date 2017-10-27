var ODataModel = {
		
	oDataModel : null,
	
	setupODataModel : function() {
		this.oDataModel = new sap.ui.model.odata.v2.ODataModel(this.getODataModelURL(), {success: this.success, error: this.error});
		sap.ui.getCore().setModel(this.oDataModel, "odata");
	},
	
	getODataModel : function() {
		if(this.oDataModel == null) {
			this.setupODataModel();
		} else {
			return sap.ui.getCore().getModel("odata");
		}
	},
	
	getODataModelURL : function() {
		if(window.location.host.includes("www")) {
			return "http://" + window.location.host.replace("www.", "") + "/WLCPWebApp/WLCPOData.svc";
		} else {
			return "http://" + window.location.host + "/WLCPWebApp/WLCPOData.svc";
		}
	},
	
	success : function() {
		
	},
	
	error : function() {
		
	}
}