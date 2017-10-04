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
	
//	jsPlumb : function() {
//		jsPlumb.ready(function () {
//			
//		    var firstInstance = jsPlumb.getInstance();
//		    firstInstance.importDefaults({
//		        Connector: ["Bezier", {
//		            curviness: 150
//		        }],
//		        Anchors: ["BottomCenter", "TopCenter"]
//		    });
//		    
//		    firstInstance.draggable("gameEditor--item_1");
//		    firstInstance.draggable("gameEditor--downstream_1");
//		    
//		    firstInstance.addEndpoint('gameEditor--item_1', {isSource:true});
//		    firstInstance.addEndpoint('gameEditor--downstream_1', {isEndpoint:true});
//		    
////		    var exampleGreyEndpointOptions = {
////		    		  endpoint:"Rectangle",
////		    		  paintStyle:{ width:25, height:21, fill:'#666' },
////		    		  isSource:true,
////		    		  connectorStyle : { stroke:"#666" },
////		    		  isTarget:true
////		    		};
////		    
////		    firstInstance.addEndpoint("gameEditor--item_1", { 
////		    	  anchor:"Bottom"
////		    	}, exampleGreyEndpointOptions); 
////
////		firstInstance.addEndpoint("gameEditor--downstream_1", { 
////		    	  anchor:"Top" 
////		    	}, exampleGreyEndpointOptions);
//
//
//
//		    
////		    firstInstance.connect({
////		        source: "gameEditor--item_1",
////		        target: "gameEditor--downstream_1",
////		        scope: "someScope",
////		        anchors:["Right", "Left" ],
////		        endpoint:"Rectangle",
////		        endpointStyle:{ fill: "yellow" }
////		    });
//
//
//		});
//	},
	
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
		 maxConnections: -1
	},
	
	setupStart : function() {
		var iDiv = document.createElement('div');
		iDiv.id = "start";
		this.boxIdCount++;
		iDiv.className = 'start';
		iDiv.innerHTML = "Start";
		//document.getElementsByTagName('body')[0].appendChild(iDiv);
		document.getElementById('gameEditor--pad').appendChild(iDiv);
		document.getElementById(iDiv.id).style.left = ((document.getElementById("gameEditor--pad").offsetWidth / 2) - (document.getElementById(iDiv.id).offsetWidth / 2)) + "px";
		document.getElementById(iDiv.id).style.top = "100px";
		jsPlumbInstance.draggable(iDiv.id);
		jsPlumbInstance.addEndpoint(iDiv.id, { anchor:"Bottom" }, this.outputEndPoint);
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
				  this.setupStart();
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



////target elements with the "draggable" class
//interact('.draggable')
//  .draggable({
//    // enable inertial throwing
//    inertia: true,
//    // keep the element within the area of it's parent
//    restrict: {
//      restriction: "parent",
//      endOnly: true,
//      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
//    },
//    // enable autoScroll
//    autoScroll: true,
//
//    // call this function on every dragmove event
//    onmove: dragMoveListener,
//    // call this function on every dragend event
//    onend: function (event) {
//      var textEl = event.target.querySelector('p');
//
//      textEl && (textEl.textContent =
//        'moved a distance of '
//        + (Math.sqrt(event.dx * event.dx +
//                     event.dy * event.dy)|0) + 'px');
//    }
//  });
//
//  function dragMoveListener (event) {
//    var target = event.target,
//        // keep the dragged position in the data-x/data-y attributes
//        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
//        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
//
//    // translate the element
//    target.style.webkitTransform =
//    target.style.transform =
//      'translate(' + x + 'px, ' + y + 'px)';
//
//    // update the posiion attributes
//    target.setAttribute('data-x', x);
//    target.setAttribute('data-y', y);
//  }