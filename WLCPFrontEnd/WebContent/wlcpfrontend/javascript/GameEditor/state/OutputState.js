/**
 * 
 */

class OutputState extends State {
	
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
		this.model = {
				data : []
		}
		this.create();
		this.fragModel = null;
	}
	
	create() {
		
		//Call the super method
		super.create();
		
		//Setup the end points
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "input", anchor:"Top", paintStyle:{ fill: "#5E696E" } }, this.inputEndPoint);
		this.jsPlumbInstance.addEndpoint(this.stateDiv.id, { id : this.htmlId + "output", anchor:"Bottom", paintStyle:{ fill: "#5E696E" } }, this.outputEndPoint);
		
		//Setup double click
		$("#"+this.stateDiv.id).dblclick($.proxy(this.doubleClick, this));
	}
	
	doubleClick() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.test2", this);
		
		//Open the dialog
		//this.getView().addDependent(this.dialog);
//		if(this.fragModel == null) {
//			this.fragModel = new sap.ui.model.json.JSONModel(this.model);
//		}
//		
//		this.dialog.setModel(this.fragModel);
			
		this.dialog.open();
		
//		for(var i = 0; i < this.model.data.length; i++) {
//			sap.ui.getCore().byId("displayTextTable").getRows()[i].getCells()[0].setSelectedKeys(this.model.data[i].row.selected);
//		}
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
	
	navigationSelected(oEvent) {
		var key = oEvent.getParameter("item").getKey();
		var navContainer = sap.ui.getCore().byId("outputStateNavContainer");
		var nextPage = sap.ui.getCore().byId(key);
		navContainer.to(nextPage);
	}
	
	static loadData(oData) {
		//Create a new display state
		var outputState = new OutputState("toolboxOutputStateTopColor", "toolboxOutputStateBottomColor", "Output State", oData.GameStateId, GameEditor.getEditorController().jsPlumbInstance);
		
		//Set the position
		outputState.setPositionX(oData.PositionX); outputState.setPositionY(oData.PositionY);
		
		//Redraw it
		outputState.draw();
		
		//Push back the state
		GameEditor.getEditorController().stateList.push(outputState);
	}
	
	save() {
		super.save("/OutputStates", this.saveState, this);
	}

	saveState(oData) {
		
		var saveData = {
			StateId : 0,
			GameStateId : this.htmlId,
			PositionX : this.positionX,
			PositionY : this.positionY,
			GameDetails : {
				__metadata : {
		             uri : ODataModel.getODataModelURL() + "/Games('" + GameEditor.getEditorController().gameModel.GameId + "')"
		         }
			},
		}
		
		super.saveState(oData, "/OutputStates", saveData);
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
}