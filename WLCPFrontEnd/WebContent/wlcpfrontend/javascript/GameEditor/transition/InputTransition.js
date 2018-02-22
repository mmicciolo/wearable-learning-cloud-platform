/**
 * 
 */

var InputTransition = class InputTransition extends Transition {
	
	constructor(cssClass, connection, overlayId, gameEditor) {
		super(cssClass, connection, overlayId, gameEditor);
		this.create();
		this.modelJSON = {
				iconTabs : []
		}
		this.modelJSON.iconTabs = this.generateData(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		this.validationRules = [];
		this.setupValidationRules();
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
	
	setupValidationRules() {
		this.validationRules.push(new TransitionValidationRule());
	}
	
	onChange(oEvent) {
		for(var i = 0; i < this.validationRules.length; i++) {
			this.validationRules[i].validate(this);
		}
    	//Revalidate the states
    	for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
    		if(!GameEditor.getEditorController().stateList[i].htmlId.includes("start")) {
        		for(var n = 0; n < GameEditor.getEditorController().stateList[i].validationRules.length; n++) {
        			GameEditor.getEditorController().stateList[i].validationRules[n].validate(GameEditor.getEditorController().stateList[i]);
        		}
    		}
    	}
	}
	
	setScope(bitMask, teamCount, playersPerTeam) {
		
		this.scopeMask = bitMask;
		var mask = bitMask;
		var model = this.modelJSON.iconTabs;
		var newTabs = [];
	
		//Test gamewide
		if(bitMask & 0x01) {
			var exists = false;
			for(var i = 0; i < model.length; i++) {
				if(model[i].scope == "Game Wide") {
					exists = true;
					newTabs.push(model[i]);
					break;
				}
			}
			if(!exists) {
				var data = this.createData();
				data.icon = "sap-icon://globe";
				data.scope = "Game Wide";
				newTabs.push(data);
			}
		}
		
		mask = mask >> 1;
		
		for(var i = 0; i < teamCount; i++) {
			if(mask & 0x01) {
				var exists = false;
				for(var n = 0; n < model.length; n++) {
					if(model[n].scope == "Team " + (i + 1)) {
						exists = true;
						newTabs.push(model[n]);
						break;
					}
				}
				if(!exists) {
					var data = this.createData();
					data.icon = "sap-icon://globe";
					data.scope = "Team " + (i + 1);
					newTabs.push(data);
				}
			}	
			mask = mask >> 1;
		}	
		
		for(var i = 0; i < teamCount; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				if(mask & 0x01) {
					var exists = false;
					for(var j = 0; j < model.length; j++) {
						if(model[j].scope == "Team " + (i + 1) + " Player " + (n + 1)) {
							exists = true;
							newTabs.push(model[j]);
							break;
						}
					}
					if(!exists) {
						var data = this.createData();
						data.icon = "sap-icon://globe";
						data.scope = "Team " + (i + 1) + " Player " + (n + 1);
						newTabs.push(data);
					}
				}
				mask = mask >> 1;
			}
		}
		
		this.modelJSON.iconTabs = newTabs;
		this.model.setData(this.modelJSON);
	}
	
	updateActiveScope() {
		
	}
	
	static load(loadData) {
		
		var connection = null;
		
		//Get the connection is transition should be placed on
		for(var n = 0; n < GameEditor.getEditorController().jsPlumbInstance.getConnections().length; n++) {
			if(GameEditor.getEditorController().jsPlumbInstance.getConnections()[n].id == loadData.connection) {
				connection = GameEditor.getEditorController().jsPlumbInstance.getConnections()[n];
				break;
			}
		}
		
		//Place the transition
		var inputTransition = new InputTransition("transition", connection, loadData.transitionId, this);
		GameEditor.getEditorController().transitionList.push(inputTransition);
		
		//Load the component data
		inputTransition.loadComponents(loadData);
	}
	
	loadComponents(loadData) {
		for(var key in loadData.activeTransitions) {
			for(var n = 0; n < this.modelJSON.iconTabs.length; n++) {
				if(key == this.modelJSON.iconTabs[n].scope) {
					this.modelJSON.iconTabs[n].activeTransition = loadData.activeTransitions[key];
				}
			}
		}
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			if(this.modelJSON.iconTabs[i].activeTransition == "Single Button Press") {
				for(var key in loadData.singleButtonPresses) {
					if(key == this.modelJSON.iconTabs[i].scope) {
						this.modelJSON.iconTabs[i].singlePress[0].selected = loadData.singleButtonPresses[key].button1;
						this.modelJSON.iconTabs[i].singlePress[1].selected = loadData.singleButtonPresses[key].button2;
						this.modelJSON.iconTabs[i].singlePress[2].selected = loadData.singleButtonPresses[key].button3;
						this.modelJSON.iconTabs[i].singlePress[3].selected = loadData.singleButtonPresses[key].button4;
					}
				}
			} else if(this.modelJSON.iconTabs[i].activeTransition == "Sequence Button Press") {
				for(var key in loadData.sequenceButtonPresses) {
					if(key == this.modelJSON.iconTabs[i].scope) {
						for(var n = 0; n < loadData.sequenceButtonPresses[key].sequences.length; n++) {
							var buttons = [];
							for(var j = 0; j < loadData.sequenceButtonPresses[key].sequences[n].length; j++) {
								buttons.push({number : parseInt(loadData.sequenceButtonPresses[key].sequences[n].charAt(j))});
							}
							this.modelJSON.iconTabs[i].sequencePress.push({buttons: buttons});
						}
					}
				}
			}
		}
	}
	
	save() {
		var activeTransitions = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			activeTransitions[this.modelJSON.iconTabs[i].scope] = this.modelJSON.iconTabs[i].activeTransition;
		}
		var singleButtonPresses = {};
		var sequenceButtonPresses = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			if(this.modelJSON.iconTabs[i].activeTransition == "Single Button Press") {
				if(this.modelJSON.iconTabs[i].singlePress[0].selected || this.modelJSON.iconTabs[i].singlePress[1].selected
				 ||this.modelJSON.iconTabs[i].singlePress[2].selected || this.modelJSON.iconTabs[i].singlePress[3].selected) {
					singleButtonPresses[this.modelJSON.iconTabs[i].scope] = {
						button1 : this.modelJSON.iconTabs[i].singlePress[0].selected,
						button2 : this.modelJSON.iconTabs[i].singlePress[1].selected,
						button3 : this.modelJSON.iconTabs[i].singlePress[2].selected,
						button4 : this.modelJSON.iconTabs[i].singlePress[3].selected
					}
				}
			} else if(this.modelJSON.iconTabs[i].activeTransition == "Sequence Button Press") {
				var sequences = [];
				for(var n = 0; n < this.modelJSON.iconTabs[i].sequencePress.length; n++) {
					var buttons = "";
					for(var j = 0; j < this.modelJSON.iconTabs[i].sequencePress[n].buttons.length; j++) {
						buttons = buttons.concat(this.modelJSON.iconTabs[i].sequencePress[n].buttons[j].number);
					}
					sequences.push(buttons);
				}
				sequenceButtonPresses[this.modelJSON.iconTabs[i].scope] = {
					sequences : sequences
				}
			}
		}
		
		var saveData = {
			transitionId : this.overlayId,
			connection : this.connection.id,
			activeTransitions : activeTransitions,
			singleButtonPresses : singleButtonPresses,
			sequenceButtonPresses : sequenceButtonPresses
		}
		
		return saveData;
	}
	
	doubleClick() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransition", this);
		
		//Set the model for the dialog
		this.dialog.setModel(this.model);
		
		//Set the on after rendering
		this.dialog.onAfterRendering = $.proxy(this.onAfterRenderingDialog, this);
			
		//Open the dialog
		this.dialog.open();
	}
	
	onAfterRenderingDialog() {
		for(var i = 0; i < sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems().length; i++) {
			var navContainer = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1];
			var path = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getBindingContext().getPath() + "/activeTransition";
			var activeTransition = this.model.getProperty(path);
			for(var n = 0; n < navContainer.getPages().length; n++) {
				if(navContainer.getPages()[n].getTitle().includes(activeTransition)) {
					navContainer.to(navContainer.getPages()[n]);
					break;
				}
			}
		}
		this.sequenceRefresh2();
	}
	
	createData() {
		return {
			icon : "",
			scope : "",
			activeTransition : "Single Button Press",
			singlePress : [
				{
					selected : false,
					enabled : true
				},
				{
					selected : false,
					enabled : true
				},
				{
					selected : false,
					enabled : true
				},
				{
					selected : false,
					enabled : true
				},
			],
			sequencePress : []
		}
	}
	
	generateData(teams, playersPerTeam) {
		
		//Create a new object to store the data
		var baseData = [];

		//Add game wide
		var data = this.createData();
		data.icon = "sap-icon://globe";
		data.scope = "Game Wide";
		baseData.push(data);
		
		//Add the teams
		for(var i = 0; i < teams; i++) {
			data = this.createData();
			data.icon = "sap-icon://group";
			data.scope = "Team " + (i + 1);
			baseData.push(data);
		}
		
		//Add the players
		for(var i = 0; i < teams; i++) {
			for(var n = 0; n < playersPerTeam; n++) {
				data = this.createData();
				data.icon = "sap-icon://employee";
				data.scope = "Team " + (i + 1) + " Player " + (n + 1);
				baseData.push(data);
			}
		}
		
		return baseData;
	}
	
	transitionTypeSelected(oEvent, oParam) {
		this.model.setProperty(oEvent.getParameters().listItem.getBindingContext().getPath() + "/activeTransition", oEvent.getParameters().listItem.getTitle());
		var navContainer = oEvent.oSource.getParent().getContentAreas()[1];
		for(var i = 0; i < navContainer.getPages().length; i++) {
			if(navContainer.getPages()[i].getTitle().includes(oEvent.getParameters().listItem.getTitle())) {
				navContainer.to(navContainer.getPages()[i]);
				break;
			}
		}
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
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
			
	    	//Revalidate the transitions
	    	for(var i = 0; i < GameEditor.getEditorController().transitionList.length; i++) {
	    		for(var n = 0; n < GameEditor.getEditorController().transitionList[i].validationRules.length; n++) {
	    			GameEditor.getEditorController().transitionList[i].validationRules[n].validate(GameEditor.getEditorController().transitionList[i]);
	    		}
	    	}
	    	
	    	//Revalidate the states
	    	for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
	    		if(!GameEditor.getEditorController().stateList[i].htmlId.includes("start")) {
	        		for(var n = 0; n < GameEditor.getEditorController().stateList[i].validationRules.length; n++) {
	        			GameEditor.getEditorController().stateList[i].validationRules[n].validate(GameEditor.getEditorController().stateList[i]);
	        		}
	    		}
	    	}
		}
	}
	
	addSequence(oEvent) {
		//Create an instance of the dialog
		this.dialog2 = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.SequenceButtonPress", this);
		
		//Set the model for the dialog
		this.dialog2.setModel(new sap.ui.model.json.JSONModel({sequence : [{}]}));
		
		//Set the on after rendering
		this.dialog2.onAfterRendering = $.proxy(this.onAfterRenderingSequence, this);
			
		//Open the dialog
		this.dialog2.open();
		
		this.path23 = oEvent.getSource().getParent().getParent().getContent()[1].getBindingContext().getPath();
	}
	
	closeSequence() {
		var sequence = $("#colorListSortable-listUl").sortable("toArray", { attribute: "class" });
		var data = this.model.getProperty(this.path23 + "/sequencePress");
		var buttonsArray = [];
		for(var i = 0; i < sequence.length; i++) {
			if(sequence[i].includes("Red")) {
				buttonsArray.push({number : 1});
			} else if(sequence[i].includes("Green")) {
				buttonsArray.push({number : 2});
			} else if(sequence[i].includes("Blue")) {
				buttonsArray.push({number : 3});
			} else if(sequence[i].includes("Black")) {
				buttonsArray.push({number : 4});
			}
		}
		data.push({buttons : buttonsArray});
		//data.push({buttons : [{number : 1}, {number : 2}, {number : 3}, {number : 4}]});
		this.model.setProperty(this.path23 + "/sequencePress", data);
		this.sequenceRefresh2();
		this.dialog2.close();
		this.dialog2.destroy();
	}
	
	sequenceRefresh2() {
		var tabs = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems();
		for(var i = 0; i < tabs.length; i++) {
			var sequences = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getPages()[1].getContent()[1].getItems()[0].getItems();
			for(var n = 0; n < sequences.length; n++) {
				var sequence = sequences[n].getContent()[0].getItems();
				for(var j = 0; j < sequence.length; j++) {
					var path = sequence[j].getBindingContext().getPath();
					var data = this.model.getProperty(path);
					if(sequence[j].hasStyleClass("sequenceButton")) {
						var stylesToRemove = [];
						for(var k = 0; k < sequence[j].aCustomStyleClasses.length; k++) {
							stylesToRemove.push(sequence[j].aCustomStyleClasses[k]);
						}
						for(var k = 0; k < stylesToRemove.length; k++) {
							sequence[j].removeStyleClass(stylesToRemove[k]);
						}
					}
					switch(data.number) {
					case 1:
						sequence[j].addStyleClass("sequenceButton sequenceButtonRed");
						break;
					case 2:
						sequence[j].addStyleClass("sequenceButton sequenceButtonGreen");
						break;
					case 3:
						sequence[j].addStyleClass("sequenceButton sequenceButtonBlue");
						break;
					case 4:
						sequence[j].addStyleClass("sequenceButton sequenceButtonBlack");
						break;
					default:
						break;
					}
				}
			}
		}
	}
	
	onAfterRenderingSequence(oEvent) {
		$("#colorListRed").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListGreen").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListBlue").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListBlack").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListSortable-listUl").sortable({update : function(event, ui) {
			//ui.item.addClass("sequenceButton sequenceButtonRed");
			console.log("update!");
		}});
	}
	
	addSequence2(oEvent) {
		var path = oEvent.getSource().getParent().getParent().getContent()[1].getBindingContext().getPath();
		var data = this.model.getProperty(path + "/sequencePress");
		data.push({buttons : [{number : 1}, {number : 2}, {number : 3}, {number : 4}]});
		this.model.setProperty(path + "/sequencePress", data);
		var list = oEvent.getSource().getParent().getParent().getContent()[1].getItems()[oEvent.getSource().getParent().getParent().getContent()[1].getItems().length - 1];
		var list2 = list.getItems()[list.getItems().length - 1];
		var id = "#" + list2.getContent()[0].getId() + "-listUl";
		list.onAfterRendering = $.proxy(this.sequenceAdded, this, id, oEvent.getSource().getParent().getParent(), list2);
		
//		list2.getContent()[0].getItems()[0].addStyleClass("sequenceButton sequenceButtonRed");
//		list2.getContent()[0].getItems()[1].addStyleClass("sequenceButton sequenceButtonGreen");
//		list2.getContent()[0].getItems()[2].addStyleClass("sequenceButton sequenceButtonBlue");
//		list2.getContent()[0].getItems()[3].addStyleClass("sequenceButton sequenceButtonBlack");
		
		
		
		
		
//		var list = new sap.m.List({showSeparators : "None"});
//		list.addItem(new sap.m.StandardListItem().addStyleClass("sequenceButton sequenceButtonRed"));
//		list.addItem(new sap.m.StandardListItem().addStyleClass("sequenceButton sequenceButtonGreen"));
//		list.addItem(new sap.m.StandardListItem().addStyleClass("sequenceButton sequenceButtonBlue"));
//		list.addItem(new sap.m.StandardListItem().addStyleClass("sequenceButton sequenceButtonBlack"));
//		var flexBox = new sap.m.FlexBox({alignItems : "Start", justifyContent : "Center"});
//		flexBox.addItem(list);
//		oEvent.getSource().getParent().getParent().addContent(flexBox);
//		oEvent.getSource().getParent().getParent().onAfterRendering = $.proxy(this.sequenceAdded, this, "#" + list.getId() + "-listUl", oEvent.getSource().getParent().getParent());
	}
	
	sequenceAdded(list, parent, list2) {
		//$(list).sortable({stop : $.proxy(this.sequenceChange, this, list2)});
		this.sequenceRefresh();
		parent.onAfterRendering = null;
	}
	
	sequenceChange(list, event, ui) {
		var array = $("#" + event.target.id).sortable("toArray");
		var order = [];
		if(array.length == 4) {
			for(var i = 0; i < 4; i++) {
				order.push(parseInt(array[i].substr(array[i].length - 1)) + 1);
			}
		}
		var path = list.getBindingContext() + "/buttons";
		var buttons = this.model.getProperty(path);
		var newOrder = [];
		while(newOrder.length != 4) {
			for(var i = 0; i < order.length; i++) {
				if(order[i] == 1) { newOrder.push(this.getOrder(buttons, 1)); order.splice(i, 1); break; }
				if(order[i] == 2) { newOrder.push(this.getOrder(buttons, 2)); order.splice(i, 1); break; }
				if(order[i] == 3) { newOrder.push(this.getOrder(buttons, 3)); order.splice(i, 1); break; }
				if(order[i] == 4) { newOrder.push(this.getOrder(buttons, 4)); order.splice(i, 1); break; }
			}
		}
		this.model.setProperty(path, newOrder);
	}
	
	getOrder(buttons, order) {
		for(var i = 0; i <buttons.length; i++) {
			if(buttons[i].number == order) {
				return buttons[i];
			}
		}
	}
	
	sequenceRefresh() {
		var tabs = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems();
		for(var i = 0; i < tabs.length; i++) {
			var sequences = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getPages()[1].getContent()[1].getItems()[0].getItems();
			for(var n = 0; n < sequences.length; n++) {
				$("#" + sequences[n].getContent()[0].getId() + "-listUl").sortable({stop : $.proxy(this.sequenceChange, this, sequences[n].getContent()[0])});
				var sequence = sequences[n].getContent()[0].getItems();
				for(var j = 0; j < sequence.length; j++) {
					var path = sequence[j].getBindingContext().getPath();
					var data = this.model.getProperty(path);
					if(sequence[j].hasStyleClass("sequenceButton")) {
						var stylesToRemove = [];
						for(var k = 0; k < sequence[j].aCustomStyleClasses.length; k++) {
							stylesToRemove.push(sequence[j].aCustomStyleClasses[k]);
						}
						for(var k = 0; k < stylesToRemove.length; k++) {
							sequence[j].removeStyleClass(stylesToRemove[k]);
						}
					}
					switch(data.number) {
					case 1:
						sequence[j].addStyleClass("sequenceButton sequenceButtonRed");
						break;
					case 2:
						sequence[j].addStyleClass("sequenceButton sequenceButtonGreen");
						break;
					case 3:
						sequence[j].addStyleClass("sequenceButton sequenceButtonBlue");
						break;
					case 4:
						sequence[j].addStyleClass("sequenceButton sequenceButtonBlack");
						break;
					default:
						break;
					}
				}
			}
		}
		
	}
}