var GameEditor = {
		
	getEditor : function() {
		return sap.ui.getCore().byId("gameEditor");
	},

	getEditorController : function() {
		return this.getEditor().getController();
	}

}