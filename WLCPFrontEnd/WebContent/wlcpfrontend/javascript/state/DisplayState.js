/**
 * 
 */

class DisplayState extends State {
	
	constructor(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance) {
		super(topColorClass, bottomColorClass, text, htmlId, jsPlumbInstance);
		this.inputEndPoint = {
				 endpoint:"Dot",
				 isTarget:true,
				 isSource:false,
				 maxConnections: -1
			};
		this.outputEndPoint = {
				 endpoint:"Dot",
				 isTarget:false,
				 isSource:true,
				 maxConnections: -1,
			};
		this.create();
	}
	
	create() {
		
		//Call the super method
		super.create();
		
		//Setup the end points
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Top", paintStyle:{ fill: "#5E696E" } }, this.inputEndPoint);
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
		
		//Setup double click
		$("#"+this.stateDiv.id).dblclick(this.doubleClick);
	}
	
	doubleClick() {
		//Create an instance of the dialog
		var dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameLobbies.CreateGameLobby", this);
		
		//Open the dialog
		this.getView().addDependent(this.dialog);
		dialog.open();
	}
}