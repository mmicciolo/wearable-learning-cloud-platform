sap.ui.controller("wlcpfrontend.controllers.GameEditor", {

	pageId : "gameEditor",
	boxId : "box",
	boxIdCount : 0,
	
	jsPlumbInstance : null,
	
	jsPlumb : function() {
		jsPlumb.ready(function () {
			this.jsPlumbInstance = jsPlumb.getInstance();
			this.jsPlumbInstance.importDefaults({Connector: ["Straight"]});
		});
	},
	
	inputEndPoint : {
		 endpoint:"Dot",
		 isTarget:true,
		 isSource:false,
		 maxConnections: -1
	},
	
	outputEndPoint : {
		 endpoint:"Dot",
		 isTarget:false,
		 isSource:true,
		 maxConnections: -1,
	},
	
	setupStart : function() {
		var startStateDiv = document.createElement('div');
		startStateDiv.id = "startState";
		this.boxIdCount++;
		startStateDiv.className = 'start';
		startStateDiv.innerHTML = "Start";
		document.getElementById('gameEditor--pad').appendChild(startStateDiv);
		document.getElementById(startStateDiv.id).style.left = ((document.getElementById("gameEditor--pad").offsetWidth / 2) - (document.getElementById(startStateDiv.id).offsetWidth / 2)) + "px";
		document.getElementById(startStateDiv.id).style.top = "100px";
		jsPlumbInstance.draggable(startStateDiv.id);
		jsPlumbInstance.addEndpoint(startStateDiv.id, { anchor:"Bottom" }, this.outputEndPoint);
	},
	
	setupStart2 : function() {
		
		//Main div
		var startStateDiv = document.createElement('div');
		startStateDiv.id = "start";
		startStateDiv.className = "newstate bordershadow";
		
		//Top color
		var topColorDiv = document.createElement('div');
		topColorDiv.className = "colorone";
		
		//Top Color Text
		var topColorText = document.createElement('div');
		topColorText.className = "centerText";
		topColorText.innerHTML = "Start State";
		topColorDiv.appendChild(topColorText);
		
		//Bottom color
		var bottomColorDiv = document.createElement('div');
		bottomColorDiv.className = "colortwo";
		
		//Append
		startStateDiv.appendChild(topColorDiv);
		startStateDiv.appendChild(bottomColorDiv);
		
		document.getElementById('gameEditor--pad').appendChild(startStateDiv);
		jsPlumbInstance.draggable(startStateDiv.id);
		jsPlumbInstance.addEndpoint(startStateDiv.id, { anchor:"Bottom", paintStyle:{ fill: "#427CAC" } }, this.outputEndPoint);
	},
	
	add2 : function() {
		
		//Main div
		var startStateDiv = document.createElement('div');
		startStateDiv.id = this.boxId + this.boxIdCount;
		this.boxIdCount++;
		startStateDiv.className = "newstate bordershadow";
		
		//Top color
		var topColorDiv = document.createElement('div');
		topColorDiv.className = "colorone";
		
		//Top Color Text
		var topColorText = document.createElement('div');
		topColorText.className = "centerText";
		topColorText.innerHTML = this.boxId + this.boxIdCount;
		topColorDiv.appendChild(topColorText);
		
		//Bottom color
		var bottomColorDiv = document.createElement('div');
		bottomColorDiv.className = "colortwo";
		
		//Append
		startStateDiv.appendChild(topColorDiv);
		startStateDiv.appendChild(bottomColorDiv);
		
		document.getElementById('gameEditor--pad').appendChild(startStateDiv);
		jsPlumbInstance.draggable(startStateDiv.id);
		jsPlumbInstance.addEndpoint(startStateDiv.id, { anchor:"Top", paintStyle:{ fill: "#427CAC" } }, this.inputEndPoint);
		jsPlumbInstance.addEndpoint(startStateDiv.id, { anchor:"Bottom", paintStyle:{ fill: "#427CAC" } }, this.outputEndPoint);
	},
	
	add : function(oEvent) {	
		var iDiv = document.createElement('div');
		iDiv.id = this.boxId + this.boxIdCount;
		this.boxIdCount++;
		iDiv.className = 'item';
		iDiv.innerHTML = "State" + iDiv.id;
		//document.getElementsByTagName('body')[0].appendChild(iDiv);
		document.getElementById('gameEditor--pad').appendChild(iDiv);
	    jsPlumbInstance.addEndpoint(iDiv.id, { anchor:"Top" }, this.inputEndPoint);
	    jsPlumbInstance.addEndpoint(iDiv.id, { anchor:"Bottom" }, this.outputEndPoint);
		jsPlumbInstance.draggable(iDiv.id);
	},
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf wlcpfrontend.views.GameEditor
*/
	onInit: function() {
		this.getView().byId("gameEditor").addEventDelegate({
			  onAfterRendering: function(){
				  this.jsPlumb();
				  this.setupStart2();
			  }
			}, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf wlcpfrontend.views.GameEditor
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf wlcpfrontend.views.GameEditor
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf wlcpfrontend.views.GameEditor
*/
//	onExit: function() {
//
//	}

});