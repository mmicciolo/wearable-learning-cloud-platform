/**
 * 
 */

class DisplayTextState extends State {
	
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
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.States.DisplayTextEdit", this);
		
		//Open the dialog
		//this.getView().addDependent(this.dialog);
		if(this.fragModel == null) {
			this.fragModel = new sap.ui.model.json.JSONModel(this.model);
		}
		
		this.dialog.setModel(this.fragModel);
			
		this.dialog.open();
		
		for(var i = 0; i < this.model.data.length; i++) {
			sap.ui.getCore().byId("displayTextTable").getRows()[i].getCells()[0].setSelectedKeys(this.model.data[i].row.selected);
		}
	}
	
	createData() {
		return {
			row : {
				scope : [],
				selected : [],
				text : ""
			}
		}
	}

	generateData(teams, playersPerTeam, alreadySelected, selectedKeys="") {
		
		//Create an object to add to the model
		var baseData = this.createData();
		
		//Only add game wide if nothing is selected
		if(alreadySelected.length == 0) {
			baseData.row.scope.push({t : "Game Wide"});
		}
		
		//If only game wide is selected return nothing
		if(alreadySelected.indexOf("Game Wide") != -1){
			baseData.row.scope.push({t : "Game Wide"});
			return baseData;
		}
		
		//Add the teams
		for(var i = 0; i < teams; i++) {
			if(selectedKeys.indexOf("Team " + (i + 1)) != -1) { baseData.row.scope.push({t : "Team " + (i + 1)}); }
			//If the following team hasn't been selected
			if(alreadySelected.indexOf("Team " + (i + 1)) == -1) {
				//Make sure none of the players have been selected
				var teamPlayerSelected = false;
				for(var n = 0; n < playersPerTeam; n++) {
					//If a player for the team was selected don't include the team
					if(alreadySelected.indexOf("Team " + (i + 1) + " Player " + (n + 1)) != -1) {
						teamPlayerSelected = true;
						break;
					}
				}
				//Player wasn't selected allow the team to be added
				if(!teamPlayerSelected) {
					baseData.row.scope.push({t : "Team " + (i + 1)});
				}
			}
		}
		
		//Add the players
		for(var i = 0; i < teams; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				if(selectedKeys.indexOf("Team " + (i + 1) + " Player " + (n + 1)) != -1) { baseData.row.scope.push({t : "Team " + (i + 1) + " Player " + (n + 1)}); }
				//If the team wasn't selected we can add the players
				if(alreadySelected.indexOf("Team " + (i + 1)) == -1) {
					//The player wasn't already selected
					if(alreadySelected.indexOf("Team " + (i + 1) + " Player " + (n + 1)) == -1) {
						baseData.row.scope.push({t : "Team " + (i + 1) + " Player " + (n + 1)});
					}
				}
			}
		}
	
		return baseData;
	}

	addTextRow() {
		//We need a connection to a parent
		if(true) {}
		
		//Get the already selected items
		var alreadySelected = this.getSurroundingSelections();
		
		//Only make the following checks if there is data in the model
		if(this.model.data.length > 0) {
			//You cannot add a row if you have not selected anything in the current row
			if(sap.ui.getCore().byId("displayTextTable").getRows()[this.model.data.length - 1].getCells()[0].getSelectedKeys().length == 0) {
				return;
			}
			//You cannot add a row if game wide is selected
			else if(alreadySelected.indexOf("Game Wide") != -1) { 
				return;
			}
		}
		
		//Generate possible selections based off of this
		var baseData = this.generateData(3, 3, alreadySelected);
		
		//Update the model
		this.model.data.push(baseData);
		this.fragModel.setData(this.model);
	}
	
	itemsToRemove(selectedItem, currentItems, removeSelected) {
		var currentItemsTemp = [];
		if(selectedItem.includes("Team") && !selectedItem.includes("Player")) {
			//Just a team
			for(var i = 0; i < currentItems.length; i++) {
				if(currentItems[i] != selectedItem || removeSelected == true) {
					if(currentItems[i].includes(selectedItem)) {
						currentItemsTemp.push(currentItems[i]);
					}
				}
			}
		} else {
			//Team Player
			for(var i = 0; i < currentItems.length; i++) {
				if(currentItems[i] != selectedItem || removeSelected == true) {
					if(selectedItem.includes(currentItems[i])) {
						currentItemsTemp.push(currentItems[i]);
					}
				}
			}
		}
		return currentItemsTemp;
	}
	
	getParentStates() {
		//Get all of the connections that come from the parent
		var connections = this.jsPlumbInstance.getConnections({target : this.htmlId});
		var sourceIds = [];
		for(var i = 0; i < connections.length; i++) {
			sourceIds.push(connections[i].sourceId);
		}
		var sourceConnections = this.jsPlumbInstance.getConnections({source : sourceIds[0]});
		var targetIds = [];
		for(var i = 0; i < sourceConnections.length; i++) {
			//if(sourceConnections[i].targetId != this.htmlId) {
				targetIds.push(sourceConnections[i].targetId);
			//}
		}
		var neighborStates = [];
		for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
			if(targetIds.indexOf(GameEditor.getEditorController().stateList[i].htmlId) != -1) {
				neighborStates.push(GameEditor.getEditorController().stateList[i]);
			}
		}
		return neighborStates;
	}
	
	getSurroundingSelections() {
		//Should loop through all other connections from parent
		var parentConnections = this.getParentStates();
		//Then loop through all rows and add all selections
		var alreadySelected = [];
		for(var i = 0; i < parentConnections.length; i++) {
			if(parentConnections[i].fragModel != null) {
				for(var n = 0; n < parentConnections[i].model.data.length; n++) {
					for(var j = 0; j < parentConnections[i].model.data[n].row.selected.length; j++) {
						alreadySelected.push(parentConnections[i].model.data[n].row.selected[j]);
					}
				}
			}
		}
//		for(var i = 0; i < sap.ui.getCore().byId("displayTextTable").getRows().length; i++) {
//			for(var n = 0; n < sap.ui.getCore().byId("displayTextTable").getRows()[i].getCells()[0].getSelectedKeys().length; n++) {
//				alreadySelected.push(sap.ui.getCore().byId("displayTextTable").getRows()[i].getCells()[0].getSelectedKeys()[n]);
//			}
//		}
		return alreadySelected;
	}
	
	updateSurroundingSelections(row, changedItem, isSelected) {
		//After a selection or deselection is made all tables need to be updated
		//If the item is selected it needs to be removed
		if(isSelected) {
			//Loop trough the rows
			for(var i = 0; i < this.model.data.length; i++) {
				//Remove everything except selected
				var items = [];
				for(var n = 0; n < this.model.data[i].row.scope.length; n++) {
					items.push(this.model.data[i].row.scope[n].t);
				}
				if(sap.ui.getCore().byId("displayTextTable").getRows()[i].getIndex() == row.getIndex()) {
					var itemsToRemove = this.itemsToRemove(changedItem, items, false);
				} else {
					var itemsToRemove = this.itemsToRemove(changedItem, items, true);
				}
				var temp = this.model.data[i].row.scope.slice();
				for(var n = 0; n < this.model.data[i].row.scope.length; n++) {
					if(itemsToRemove.indexOf(this.model.data[i].row.scope[n].t) != -1) {
						temp.splice(temp.indexOf(this.model.data[i].row.scope[n]), 1);
					}
				}
				this.model.data[i].row.scope = temp;
			}
			this.model.data[row.getIndex()].row.selected.push(changedItem);
		} else {
			for(var i = 0; i < this.model.data.length; i++) {
				//If its another row we need to regenerate and replace the selected
				var selectedKeys = sap.ui.getCore().byId("displayTextTable").getRows()[i].getCells()[0].getSelectedKeys();
				var alreadySelected = this.getSurroundingSelections();
				var selected = this.model.data[i].row.selected.slice();
				this.model.data[i] = this.generateData(3,3,alreadySelected,selectedKeys);
				this.model.data[i].row.selected = selected;
				this.fragModel.setData(this.model);	
				sap.ui.getCore().byId("displayTextTable").getRows()[i].getCells()[0].setSelectedKeys(selectedKeys);
			}
			this.model.data[row.getIndex()].row.selected.splice(this.model.data[row.getIndex()].row.selected.indexOf(changedItem), 1);
		}
		this.fragModel.setData(this.model);	
	}
	
	handleSelectionChange(oEvent) {
		var changedItem = oEvent.getParameter("changedItem");
		var isSelected = oEvent.getParameter("selected");
		
		this.updateSurroundingSelections(oEvent.oSource.getParent(), changedItem.getKey(), isSelected);
	}
	
	static loadData(oData) {
		//Create a new display state
		var displayTextState = new DisplayTextState("toolboxDisplayTextStateTopColor", "toolboxDisplayTextStateBottomColor", "Display Text", oData.GameStateId, GameEditor.getEditorController().jsPlumbInstance);
		
		//Set the position
		displayTextState.setPositionX(oData.PositionX); displayTextState.setPositionY(oData.PositionY);
		
		//Redraw it
		displayTextState.draw();
		
		//Push back the state
		GameEditor.getEditorController().stateList.push(displayTextState);
	}
	
	save() {
		super.save("/DisplayTextStates", this.saveState, this);
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
			DisplayText : "TEXT"
		}
		
		super.saveState(oData, "/DisplayTextStates", saveData);
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
}