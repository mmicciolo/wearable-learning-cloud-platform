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
		this.transitionConfigs = [];
		this.setupTransitionConfigs();
		this.modelJSON.iconTabs = this.generateData(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		this.model = new sap.ui.model.json.JSONModel(this.modelJSON);
		this.validationRules = [];
		this.setupValidationRules();
		this.scopeMask = 0xffffffff;
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
	
	setupTransitionConfigs() {
		this.transitionConfigs.push(new TransitionConfigSingleButtonPress(this));
	}
	
	setupValidationRules() {
		this.validationRules.push(new TransitionValidationRule());
		this.validationRules.push(new TransitionSelectedTypeValidationRule());
	}
	
	onChange(oEvent) {
		for(var i = 0; i < this.validationRules.length; i++) {
			this.validationRules[i].validate(this);
		}
//    	//Revalidate the states
//    	for(var i = 0; i < GameEditor.getEditorController().stateList.length; i++) {
//    		if(!GameEditor.getEditorController().stateList[i].htmlId.includes("start")) {
//        		for(var n = 0; n < GameEditor.getEditorController().stateList[i].validationRules.length; n++) {
//        			GameEditor.getEditorController().stateList[i].validationRules[n].validate(GameEditor.getEditorController().stateList[i]);
//        		}
//    		}
//    	}
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
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			this.transitionConfigs[i].setLoadData(loadData, this.modelJSON.iconTabs);
		}
//		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
//			if(this.modelJSON.iconTabs[i].activeTransition == "Single Button Press") {
//				for(var key in loadData.singleButtonPresses) {
//					if(key == this.modelJSON.iconTabs[i].scope) {
//						this.modelJSON.iconTabs[i].singlePress[0].selected = loadData.singleButtonPresses[key].button1;
//						this.modelJSON.iconTabs[i].singlePress[1].selected = loadData.singleButtonPresses[key].button2;
//						this.modelJSON.iconTabs[i].singlePress[2].selected = loadData.singleButtonPresses[key].button3;
//						this.modelJSON.iconTabs[i].singlePress[3].selected = loadData.singleButtonPresses[key].button4;
//					}
//				}
//			} else if(this.modelJSON.iconTabs[i].activeTransition == "Sequence Button Press") {
//				for(var key in loadData.sequenceButtonPresses) {
//					if(key == this.modelJSON.iconTabs[i].scope) {
//						for(var n = 0; n < loadData.sequenceButtonPresses[key].sequences.length; n++) {
//							var buttons = [];
//							for(var j = 0; j < loadData.sequenceButtonPresses[key].sequences[n].length; j++) {
//								buttons.push({number : parseInt(loadData.sequenceButtonPresses[key].sequences[n].charAt(j))});
//							}
//							this.modelJSON.iconTabs[i].sequencePress.push({buttons: buttons});
//						}
//					}
//				}
//			} else if(this.modelJSON.iconTabs[i].activeTransition == "Keyboard Input") {
//				for(var key in loadData.keyboardInputs) {
//					if(key == this.modelJSON.iconTabs[i].scope) {
//						for(var n = 0; n < loadData.keyboardInputs[key].keyboardInputs.length; n++) {
//							this.modelJSON.iconTabs[i].keyboardField.push({value: loadData.keyboardInputs[key].keyboardInputs[n]});
//						}
//					}
//				}
//			}
//		} 
	}
	
	save() {
		var activeTransitions = {};
		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
			activeTransitions[this.modelJSON.iconTabs[i].scope] = this.modelJSON.iconTabs[i].activeTransition;
		}
//		var singleButtonPresses = {};
//		var sequenceButtonPresses = {};
//		var keyboardInputs = {};
//		for(var i = 0; i < this.modelJSON.iconTabs.length; i++) {
//			if(this.modelJSON.iconTabs[i].activeTransition == "Single Button Press") {
//				if(this.modelJSON.iconTabs[i].singlePress[0].selected || this.modelJSON.iconTabs[i].singlePress[1].selected
//				 ||this.modelJSON.iconTabs[i].singlePress[2].selected || this.modelJSON.iconTabs[i].singlePress[3].selected) {
//					singleButtonPresses[this.modelJSON.iconTabs[i].scope] = {
//						button1 : this.modelJSON.iconTabs[i].singlePress[0].selected,
//						button2 : this.modelJSON.iconTabs[i].singlePress[1].selected,
//						button3 : this.modelJSON.iconTabs[i].singlePress[2].selected,
//						button4 : this.modelJSON.iconTabs[i].singlePress[3].selected
//					}
//				}
//			} else if(this.modelJSON.iconTabs[i].activeTransition == "Sequence Button Press") {
//				var sequences = [];
//				for(var n = 0; n < this.modelJSON.iconTabs[i].sequencePress.length; n++) {
//					var buttons = "";
//					for(var j = 0; j < this.modelJSON.iconTabs[i].sequencePress[n].buttons.length; j++) {
//						buttons = buttons.concat(this.modelJSON.iconTabs[i].sequencePress[n].buttons[j].number);
//					}
//					sequences.push(buttons);
//				}
//				sequenceButtonPresses[this.modelJSON.iconTabs[i].scope] = {
//					sequences : sequences
//				}
//			} else if(this.modelJSON.iconTabs[i].activeTransition == "Keyboard Input") {
//				var keyboardInputStrings = [];
//				for(var n = 0; n < this.modelJSON.iconTabs[i].keyboardField.length; n++) {
//					keyboardInputStrings.push(this.modelJSON.iconTabs[i].keyboardField[n].value);
//				}
//				keyboardInputs[this.modelJSON.iconTabs[i].scope] = {
//					keyboardInputs : keyboardInputStrings
//				}
//			}
//		} 
		
		var saveData = {
			transitionId : this.overlayId,
			connection : this.connection.id,
			activeTransitions : activeTransitions,
//			singleButtonPresses : singleButtonPresses,
//			sequenceButtonPresses : sequenceButtonPresses,
//			keyboardInputs : keyboardInputs,
			connectionJPA : {
				connectionId : this.wlcpConnection.connectionId
			}
		}
		
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			var data = this.transitionConfigs[i].getSaveData();
			for(var key in data) {
				saveData[key] = data[key];
			}
		}
		
		return saveData;
	}
	
	doubleClick() {
		
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransition", this);
		
		//Set the model for the dialog
		this.dialog.setModel(this.model);
		
		//Setup the state config pages + models
		var iconTabBar = sap.ui.getCore().byId("inputTransitionDialogIconTabBar").getItems();
		for(var i = 0; i < iconTabBar.length; i++) {
			for(var n = 0; n < iconTabBar[i].getContent()[0].getContentAreas()[1].getPages().length; n++) {
				var iconTabBarPage = iconTabBar[i].getContent()[0].getContentAreas()[1].getPages()[n];
				if(iconTabBarPage.getContent().length == 0) {
					var fragment = this.transitionConfigs[n].getTransitionConfigFragment();
					if(typeof fragment === 'object' && fragment.constructor === Array) {
						fragment.forEach(function (oElement) {iconTabBarPage.addContent(oElement);});
					} else {
						iconTabBarPage.addContent(fragment);
					}
				}
			}
		}
		
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
			//var transitionTypes = this.model.getProperty(sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getBindingContext().getPath() + "/transitionTypes");
			var transitionTypes = this.model.getProperty(sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getBindingContext().getPath() + "/navigationContainerPages");
			for(var n = 0; n < transitionTypes.length; n++) {
				if(transitionTypes[n].title == activeTransition) { transitionTypes[n].selected = true; }
				else { transitionTypes[n].selected = false; }
			}
			this.model.setProperty(sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getBindingContext().getPath() + "/navigationContainerPages", transitionTypes);
			for(var n = 0; n < navContainer.getPages().length; n++) {
				if(navContainer.getPages()[n].getTitle().includes(activeTransition)) {
					navContainer.to(navContainer.getPages()[n]);
					break;
				}
			}
		}
		//this.sequenceRefresh();
	}
	
	createData() {
		var tempNavigationListItems = [];
		var tempNavigationContainerPages = [];
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			tempNavigationListItems.push(this.transitionConfigs[i].getNavigationListItem());
			tempNavigationContainerPages.push(this.transitionConfigs[i].getNavigationContainerPage());
		}
		return {
			icon : "",
			scope : "",
			activeTransition : "Single Button Press",
			navigationListItems : tempNavigationListItems,
			navigationContainerPages : tempNavigationContainerPages
//			transitionTypes : [{
//				title : "Single Button Press",
//				icon : "sap-icon://touch",
//				selected : true,
//				visible : true
//			},
//			{
//				title : "Sequence Button Press",
//				icon : "sap-icon://multiselect-none",
//				selected : false,
//				visible : true
//			},
//			{
//				title : "Keyboard Input",
//				icon : "sap-icon://keyboard-and-mouse",
//				selected : false,
//				visible : true
//			}],
//			singlePress : [
//				{
//					selected : false,
//					enabled : true
//				},
//				{
//					selected : false,
//					enabled : true
//				},
//				{
//					selected : false,
//					enabled : true
//				},
//				{
//					selected : false,
//					enabled : true
//				},
//			],
//			sequencePress : [],
//			keyboardField : []
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
		this.model.setProperty(oEvent.getSource().getBindingContext() + "/activeTransition", oEvent.getParameters().listItem.getTitle());
		var transitionTypes = this.model.getProperty(oEvent.getSource().getBindingContext() + "/transitionTypes");
		for(var i = 0; i < transitionTypes.length; i++) {
			if(transitionTypes[i].title == oEvent.getParameters().listItem.getTitle()) { transitionTypes[i].selected = true; }
			else { transitionTypes[i].selected = false; }
		}
		this.model.setProperty(oEvent.getSource().getBindingContext() + "/transitionTypes", transitionTypes);
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
		DataLogger.logGameEditor();
	}
	
	closeDialog2() {
		this.dialog2.close();
		this.dialog2.destroy();
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
			
			//Remove the connections pointer to us
			this.wlcpConnection.transition = null;
			
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
	    	
	    	//Log it
	    	DataLogger.logGameEditor();
		}
	}
	
	getActiveScopes() {
		var activeScopes = [];
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			var tempActiveScopes = this.transitionConfigs[i].getActiveScopes();
			for(var n = 0; n < tempActiveScopes.length; n++) {
				if(activeScopes.indexOf(tempActiveScopes[n]) == -1) {
					activeScopes.push(tempActiveScopes[n]);
				}
			}
		}
		return activeScopes;
	}
	
	getFullyActiveScopes(neighborTransitions) {
		var activeScopes = [];
		for(var i = 0; i < this.transitionConfigs.length; i++) {
			var tempActiveScopes = this.transitionConfigs[i].getFullyActiveScopes(neighborTransitions);
			for(var n = 0; n < tempActiveScopes.length; n++) {
				if(activeScopes.indexOf(tempActiveScopes[n]) == -1) {
					activeScopes.push(tempActiveScopes[n]);
				}
			}
		}
		return activeScopes;
	}
	
//	addSequence(oEvent) {
//		//Create an instance of the dialog
//		this.dialog2 = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.SequenceButtonPress", this);
//		
//		//Set the model for the dialog
//		this.dialog2.setModel(new sap.ui.model.json.JSONModel({sequence : [{}]}));
//		
//		//Set the on after rendering
//		this.dialog2.onAfterRendering = $.proxy(this.onAfterRenderingSequence, this);
//			
//		//Open the dialog
//		this.dialog2.open();
//		
//		this.path23 = oEvent.getSource().getParent().getParent().getContent()[1].getBindingContext().getPath();
//	}
//	
//	deleteSequence(oEvent) {
//		this.deletePath = oEvent.getSource().getBindingContext().getPath();
//		this.deleteSequencePath = oEvent.getSource().getParent().getParent().getBindingContext().getPath() + "/sequencePress";
//		sap.m.MessageBox.confirm("Are you sure you want to delete this sequence?", {onClose : $.proxy(this.deleteOnClose, this)});
//	}
//	
//	deleteOnClose(oEvent) {
//		//var path = oEvent.getSource().getBindingContext().getPath();
//		var splitPath = this.deletePath.split("/");
//		var index = parseInt(splitPath[splitPath.length - 1]);
//		//var sequencePath = oEvent.getSource().getParent().getParent().getBindingContext().getPath() + "/sequencePress";
//		var sequenceArray = this.model.getProperty(this.deleteSequencePath);
//		sequenceArray.splice(index, 1);
//		this.model.setProperty(this.deleteSequencePath, sequenceArray);
//		this.onChange();
//		this.sequenceRefresh();
//	}
//	
//	onAfterRenderingSequence(oEvent) {
//		$("#colorListRed").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
//		$("#colorListGreen").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
//		$("#colorListBlue").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
//		$("#colorListBlack").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
//		$("#colorListSortable-listUl").sortable();
//	}
//	
//	closeSequence() {
//		var sequence = $("#colorListSortable-listUl").sortable("toArray", { attribute: "class" });
//		var data = this.model.getProperty(this.path23 + "/sequencePress");
//		var buttonsArray = [];
//		for(var i = 0; i < sequence.length; i++) {
//			if(sequence[i].includes("Red")) {
//				buttonsArray.push({number : 1});
//			} else if(sequence[i].includes("Green")) {
//				buttonsArray.push({number : 2});
//			} else if(sequence[i].includes("Blue")) {
//				buttonsArray.push({number : 3});
//			} else if(sequence[i].includes("Black")) {
//				buttonsArray.push({number : 4});
//			}
//		}
//		if(buttonsArray.length == 0) {
//			sap.m.MessageBox.information("Adding an empty sequence means the transition will occur if none of the defined sequences are input (i.e. wrong sequence).");
//		}
//		var sequenceValidation = new TransitionSequenceButtonPressValidationRule();
//		if(!sequenceValidation.validate(this, {buttons : buttonsArray}, this.model.getProperty(this.path23).scope)) {
//			sap.m.MessageBox.error("That sequence already exists in this scope (possibly in another neighbor transition)!");
//		} else {
//			data.push({buttons : buttonsArray});
//			this.model.setProperty(this.path23 + "/sequencePress", data);
//			this.onChange();
//			this.onAfterRenderingDialog();
//			//this.sequenceRefresh();
//		}
//		this.dialog2.close();
//		this.dialog2.destroy();
//	}
//	
//	sequenceRefresh() {
//		var tabs = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems();
//		for(var i = 0; i < tabs.length; i++) {
//			var sequences = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getPages()[1].getContent()[1].getItems()[0].getItems();
//			for(var n = 0; n < sequences.length; n++) {
//				var sequence = sequences[n].getContent()[0].getItems();
//				for(var j = 0; j < sequence.length; j++) {
//					var path = sequence[j].getBindingContext().getPath();
//					var data = this.model.getProperty(path);
//					if(sequence[j].hasStyleClass("sequenceButton")) {
//						var stylesToRemove = [];
//						for(var k = 0; k < sequence[j].aCustomStyleClasses.length; k++) {
//							stylesToRemove.push(sequence[j].aCustomStyleClasses[k]);
//						}
//						for(var k = 0; k < stylesToRemove.length; k++) {
//							sequence[j].removeStyleClass(stylesToRemove[k]);
//						}
//					}
//					switch(data.number) {
//					case 1:
//						sequence[j].addStyleClass("sequenceButton sequenceButtonRed");
//						break;
//					case 2:
//						sequence[j].addStyleClass("sequenceButton sequenceButtonGreen");
//						break;
//					case 3:
//						sequence[j].addStyleClass("sequenceButton sequenceButtonBlue");
//						break;
//					case 4:
//						sequence[j].addStyleClass("sequenceButton sequenceButtonBlack");
//						break;
//					default:
//						break;
//					}
//				}
//			}
//		}
//	}
//	
//	addKeyboardField(oEvent) {
//		//Create an instance of the dialog
//		this.dialog2 = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.KeyboardInput", this);
//			
//		//Open the dialog
//		this.dialog2.open();
//		
//		//Store the scopes path
//		this.path23 = oEvent.getSource().getParent().getParent().getContent()[1].getBindingContext().getPath();
//	}
//	
//	closeKeyboardInput(oEvent) {
//		var keyboardInputValue = sap.ui.getCore().byId("keyboardInput").getValue().toLowerCase();
//		var keyboardValidation = new TransitionKeyboardInputValidationRule();
//		if(!keyboardValidation.validate(this, keyboardInputValue, this.model.getProperty(this.path23).scope)) {
//			sap.m.MessageBox.error("That keyboard input already exists in this scope (possibly in another neighbor transition)!");
//		} else {
//			if(keyboardInputValue == "") {
//				sap.m.MessageBox.information("Adding an empty keyboard input means the transition will occur if none of the defined strings are input (i.e. wrong sequence).");
//			}
//			var data = this.model.getProperty(this.path23 + "/keyboardField");
//			data.push({value : keyboardInputValue});
//			this.model.setProperty(this.path23 + "/keyboardField", data);
//			this.onChange();
//			this.dialog2.close();
//			this.dialog2.destroy();
//		}
//	}
//	
//	deleteKeyboardField(oEvent) {
//		this.deletePath = oEvent.getSource().getBindingContext().getPath();
//		this.deleteKeyboardPath = oEvent.getSource().getParent().getParent().getParent().getBindingContext().getPath() + "/keyboardField";
//		sap.m.MessageBox.confirm("Are you sure you want to delete this keyboard input?", {onClose : $.proxy(this.keyboardDeleteOnClose, this)});
//	}
//	
//	keyboardDeleteOnClose(oEvent) {
//		var splitPath = this.deletePath.split("/");
//		var index = parseInt(splitPath[splitPath.length - 1]);
//		var sequenceArray = this.model.getProperty(this.deleteKeyboardPath);
//		sequenceArray.splice(index, 1);
//		this.model.setProperty(this.deleteKeyboardPath, sequenceArray);
//		this.onChange();
//	}
}