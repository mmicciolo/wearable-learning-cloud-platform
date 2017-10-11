/**
 * 
 */
class ButtonPressTransition extends Transition {
	
	constructor(cssClass, connection, jsPlumbInstance) {
		super(cssClass, connection, jsPlumbInstance);
		this.colorCount = 0;
		this.create();
	}
	
	create() {
		
		//Add the overlay
		this.connection.addOverlay([ "Label", { label: "<div class=\"centerTransitionText\"/><div>Button</div><div>Press</div></div>", cssClass : this.cssClass + " jtk-drag-select" }]);
		
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
	
	setBackgroundColor(color) {
		document.getElementById(this.htmlId).style.backgroundColor = color;
	}
	
	doubleClick() {
		console.log("Transition Clicked");
		if(this.colorCount == 0) {
			this.setBackgroundColor("red");
			this.colorCount++;
		} else if(this.colorCount == 1) {
			this.setBackgroundColor("green");
			this.colorCount++;
		} else if(this.colorCount == 2) {
			this.setBackgroundColor("blue");
			this.colorCount++;
		} else if(this.colorCount == 3) {
			this.setBackgroundColor("black");
			this.colorCount++;
		} else if(this.colorCount == 4) {
			this.setBackgroundColor("#5E696E");
			this.colorCount = 0;
		}
	}
}