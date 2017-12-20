/**
 * 
 */

class InputTransition extends Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		super(cssClass, connection, overlayId, gameEditor);
		this.create();
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
	
	save() {
		var saveData = {
			transitionId : overlayId,
			connection : {
				
			}
		}
	}
	
	doubleClick() {
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransition", this);
		
		//Set the model for the dialog
		//this.dialog.setModel(this.model);
			
		//Open the dialog
		this.dialog.open();
	}
}