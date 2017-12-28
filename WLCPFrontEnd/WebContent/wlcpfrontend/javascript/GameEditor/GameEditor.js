var GameEditor = {
		
	getEditor : function() {
		return sap.ui.getCore().byId("gameEditor");
	},

	getEditorController : function() {
		return this.getEditor().getController();
	},
	
	getScrollTopOffset : function() {
		return document.getElementById("gameEditor--mainSplitter-content-1").scrollTop;
	},
	
	getScrollLeftOffset : function() {
		return document.getElementById("gameEditor--mainSplitter-content-1").scrollLeft;
	}

}