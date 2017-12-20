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
		this.connection.addOverlay([ "Label", {id : this.overlayId, label: "<div id=" + "\"" + this.overlayId + "_delete\"" + "class=\"close2-thik\"></div><div class=\"centerTransitionText\"/><div>Input</div><div>Transition</div></div>", cssClass : this.cssClass + " jtk-drag-select"}]);
		
		//Store the id
		for(var key in this.connection.getOverlays()) {
			if(this.connection.getOverlays()[key].hasOwnProperty("label")) {
				  this.htmlId = this.connection.getOverlays()[key].canvas.id;
				  break;
			}
		}
		
		//Setup double click
		$("#"+this.htmlId).dblclick($.proxy(this.doubleClick, this));
		
		//Setup delete click
		$("#" + this.overlayId + "_delete").click($.proxy(this.remove, this));
	}
	
	save() {
		var saveData = {
			transitionId : this.overlayId,
			connection : this.connection.id
		}
		
		return saveData;
	}
	
	doubleClick() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransition", this);
		
		//Set the model for the dialog
		//this.dialog.setModel(this.model);
			
		//Open the dialog
		this.dialog.open();
	}
	
	remove() {
		
		//Open a dialog so the user can confirm the delete
		sap.m.MessageBox.confirm("Are you sure you want to delete this transition?", {onClose : $.proxy(this.removeTransition, this)});
	}
	
	removeTransition(oAction) {
		
		//If they click OK, delete
		if(oAction == sap.m.MessageBox.Action.OK) {
			
			//Remove the overlay
			this.connection.removeOverlay(this.overlayId);
			
			//Remove it from the list
			GameEditor.getEditorController().transitionList.splice(GameEditor.getEditorController().transitionList.indexOf(this), 1);
		}
	}
	
}