/**
 * 
 */
class Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		this.cssClass = cssClass;
		//this.text = text;
		this.width = 0;
		this.height = 0;
		this.connection = connection;
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