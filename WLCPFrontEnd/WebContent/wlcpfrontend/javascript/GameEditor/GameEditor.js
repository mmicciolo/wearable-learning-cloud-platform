var GameEditor = {
		
	getEditor : function() {
		return sap.ui.getCore().byId("gameEditor");
	},

	getEditorController : function() {
		return this.getEditor().getController();
	},
	
	getJsPlumbInstance : function() {
		return this.getEditor().getController().jsPlumbInstance;
	},
	
	getScrollTopOffset : function() {
		return document.getElementById("gameEditor--mainSplitter-content-1").scrollTop;
	},
	
	getScrollLeftOffset : function() {
		return document.getElementById("gameEditor--mainSplitter-content-1").scrollLeft;
	},
	
	resetScroll : function() {
		document.getElementById("gameEditor--pad").style.width = "100%";
		document.getElementById("gameEditor--pad").style.height = "100%";
	}

}