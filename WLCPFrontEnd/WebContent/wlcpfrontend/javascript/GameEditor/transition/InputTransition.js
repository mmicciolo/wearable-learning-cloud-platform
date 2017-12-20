/**
 * 
 */

class InputTransition extends Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		super(cssClass, connection, overlayId, gameEditor);
		this.create();
	}
	
	verify() {
		
		//Get the connections of the state the transitions originates from
		var connections = this.jsPlumbInstance.getConnections({source : this.connection.source.id});
		
		//Loop through all of the connections
		for(var i = 0; i < connections.length; i++) {
			
			//Loop through the overlays in the connections
			for(var key in connections[i].getOverlays()) {
				
				//If its a label we are interested
				if(connections[i].getOverlays()[key].id.includes("buttonPressTransition")) {
					var buttonPressTransition = this.gameEditor.transitionMap.get(connections[i].getOverlays()[key].id);
					if(buttonPressTransition.getButtonColor() == ButtonColor.ANY) {
						console.log("Cannot add");
					}
				}
			}
		}

	}
	
	create() {
		
		//Add the overlay
		this.connection.addOverlay([ "Label", {id : this.overlayId, label: "<div class=\"centerTransitionText\"/><div>Input</div><div>Transition</div></div>", cssClass : this.cssClass + " jtk-drag-select"}]);
		
		//Store the id
		for(var key in this.connection.getOverlays()) {
			if(this.connection.getOverlays()[key].hasOwnProperty("label")) {
				  this.htmlId = this.connection.getOverlays()[key].canvas.id;
				  break;
			}
		}
		
		//Setup double click
		$("#"+this.htmlId).dblclick($.proxy(this.doubleClick, this));
	}
	
	doubleClick() {

	}
}