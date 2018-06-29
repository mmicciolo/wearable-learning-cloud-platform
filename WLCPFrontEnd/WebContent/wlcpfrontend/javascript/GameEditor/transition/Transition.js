/**
 * 
 */
var Transition = class Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		this.cssClass = cssClass;
		//this.text = text;
		this.width = 0;
		this.height = 0;
		this.connection = connection;
		this.wlcpConnection = null;
		this.overlayId = overlayId;
		this.htmlId = "";
		this.gameEditor = gameEditor;
		this.jsPlumbInstance = gameEditor.jsPlumbInstance;
	}
	
	static absoluteToRelativeX(absoluteX, width) {
		return absoluteX - (document.getElementById("gameEditor--toolbox").getBoundingClientRect().width + document.getElementById("gameEditor--mainSplitter-splitbar-0").getBoundingClientRect().width + (width / 2));
	}
	
	static absoluteToRelativeY(absoluteY) {
		return absoluteY;// + document.getElementById("gameEditor--toolbox-scroll").offsetHeight;
	}
	
	create() {
		return this;
	}
	
	save() {
		return [];
	}
	
	static getClosestConnection(positionX, positionY, jsPlumbInstance) {
		
		var start = new Date().getTime();
		
		var localX = this.absoluteToRelativeX(positionX, 75) + GameEditor.getScrollLeftOffset();
		var localY = this.absoluteToRelativeY(positionY) + GameEditor.getScrollTopOffset();;
		
		//Place holder for found connections
		var connections = [];
		
		//Loop through all bounding boxes of connections and select ones the transition falls within
		for(var i = 0; i < jsPlumbInstance.getConnections().length; i++) {
			
			//Get positions and size of bounding box
			var x = parseFloat(jsPlumbInstance.getConnections()[i].canvas.style.left.replace("px", ""));
			var y = parseFloat(jsPlumbInstance.getConnections()[i].canvas.style.top.replace("px", ""));
			var h = jsPlumbInstance.getConnections()[i].canvas.getBoundingClientRect().height;
			var w = jsPlumbInstance.getConnections()[i].canvas.getBoundingClientRect().width;
			
			//Check if the transition is within the bounding box
			if(((localX < (x + w)) && ((localX + 75) > x)) && (((localY < (y + h)) && ((localY + 62.5) > y)))) {

				//Check if the connection already has a label
				var hasLabel = false;
				for(var key in jsPlumbInstance.getConnections()[i].getOverlays()) {
					if(jsPlumbInstance.getConnections()[i].getOverlays()[key].hasOwnProperty("label")) {
						  hasLabel = true;
					}
				}
				
				//Only care about connections that dont have labels
				if(!hasLabel) {
					connections.push(jsPlumbInstance.getConnections()[i]);
			  }   		
		   }
		}
		
		//We need to figure out the closest
		var closestConnection = null;
		var closestDistance = 0;
		
		//Loop through the connections
		for(var i = 0; i < connections.length; i++) {
			
			//Get the svg segments
			var segments = connections[i].canvas.firstChild.getPathData();
			
			//Loop through and calculate all of bounding boxes for the segments
			for(var n = 0; n < segments.length; n = n + 2) {
				
				//Get segment 1 and transform it to pad space
				var seg1 = connections[i].canvas.createSVGPoint();
				seg1.x = segments[n].values[segments[n].values.length - 2];
				seg1.y = segments[n].values[segments[n].values.length - 1];
				seg1 = seg1.matrixTransform(connections[i].canvas.firstChild.transform.baseVal[0].matrix);
				
				//Get segment 1 and transform it to pad space
				var seg2 = connections[i].canvas.createSVGPoint();
				seg2.x = segments[n + 1].values[segments[n + 1].values.length - 2];
				seg2.y = segments[n + 1].values[segments[n + 1].values.length - 1];
				seg2 = seg2.matrixTransform(connections[i].canvas.firstChild.transform.baseVal[0].matrix);
				
				//Add the offset of the connection bounding box
				seg1.x += parseFloat(connections[i].canvas.style.left.replace("px", ""));
				seg1.y += parseFloat(connections[i].canvas.style.top.replace("px", ""));
				seg2.x += parseFloat(connections[i].canvas.style.left.replace("px", ""));
				seg2.y += parseFloat(connections[i].canvas.style.top.replace("px", ""));
				
				//Local variables for bounding box calculation
				var minX, maxX, minY, maxY;
				
				//Find the minX and maxX for bb
				if(seg1.x > seg2.x) {
					maxX = seg1.x;
					minX = seg2.x;
				} else {
					maxX = seg2.x;
					minX = seg1.x;
				}
				
				//Find the minY and maxY for bb
				if(seg1.y > seg2.y) {
					maxY = seg1.y;
					minY = seg2.y;
				} else {
					maxY = seg2.y;
					minY = seg1.y;
				}
				
				//Local variables for width and height calculation
				var bbx = minX;
				var bby = minY;
				var bbw, bbh;
				
				//If the width is zero set it to 10
				if((maxX - minX) != 0) {
					bbw = maxX - minX;
				} else {
					bbw = 10;
				}
				
				//If the height is zero set it to 10
				if((maxY - minY) != 0) {
					bbh = maxY - minY;
				} else {
					bbh = 10;
				}
				
//				var div = document.createElement('div');
//				div.style.position = "absolute";
//				div.style.backgroundColor = "black";
//				div.style.top = bby + "px";
//				div.style.left = bbx + "px";
//				div.style.width = bbw + "px";
//				div.style.height = bbh + "px";
//				document.getElementById('gameEditor--pad').appendChild(div);
				
				//If the transition is in the segments bounding box, return the current connection
				if(((localX < (bbx + bbw)) && ((localX + 75) > bbx)) && (((localY < (bby + bbh)) && ((localY + 62.5) > bby)))) {
					return connections[i];
				}	
			}
		}
		
		return null;
	}

	static getClosestConnection2(positionX, positionY, jsPlumbInstance) {
		
		//Get the position of the transition
		var localX = this.absoluteToRelativeX(positionX, 75);
		var localY = this.absoluteToRelativeY(positionY);
		
		//Place holder for found connections
		var connections = [];
		
		//Loop through all bounding boxes of connections and select ones the transition falls within
		for(var i = 0; i < jsPlumbInstance.getConnections().length; i++) {
			
			//Get positions and size of bounding box
			var x = jsPlumbInstance.getConnections()[i].connector.x;
			var y = jsPlumbInstance.getConnections()[i].connector.y;
			var h = jsPlumbInstance.getConnections()[i].connector.h;
			var w = jsPlumbInstance.getConnections()[i].connector.w;
			
			//Check if the transition is within the bounding box
			if(localX < x + w && localX + 75 > x && localY < y + h && localY + 62.5 > y) {
				
				//Check if the connection already has a label
				var hasLabel = false;
				for(var key in jsPlumbInstance.getConnections()[i].getOverlays()) {
					if(jsPlumbInstance.getConnections()[i].getOverlays()[key].hasOwnProperty("label")) {
						  hasLabel = true;
					}
				}
				
				//Only care about connections that dont have labels
				if(!hasLabel) {
					connections.push(jsPlumbInstance.getConnections()[i]);
			  }   		
		   }
		}
		
		//If there is only 1 connection, return it
		if(connections.length == 1) {
			return connections[0];
		} else if(connections.length != 0) { //If there is more than one connection
			
			//We need to figure out the closest
			var closestConnection = null;
			var closestDistance = 0;
			
			//Loop through the connections
			for(var i = 0; i < connections.length; i++) {
				
				//Get positions and size of bounding box
				var x = connections[i].connector.x;
				var y = connections[i].connector.y;
				var h = connections[i].connector.h;
				var w = connections[i].connector.w;
				
				//Get the center point of the box
				var centerX = x + (w / 2);
				var centerY = y + (h / 2);
				
				//Calculate the distance from the transition to the center of the bounding box of the connection
				var distance = Math.sqrt(Math.pow((centerX - localX), 2) + Math.pow((centerY - localY), 2));
				
				//If its the first connection set up the variables
				if(closestConnection == null) {
					closestConnection = connections[i];
					closestDistance = distance;
				} else { //If its not the first connection
					
					//Check to see if this connection is closer
					if(distance < closestDistance) {
						
						//If it is, make it the new closest
						closestConnection = connections[i];
						closestDistance = distance;
					}
				}
			}
			//Return the closest connection
			return closestConnection;
		} else {
			return null;
		}
	}
}