var TransitionConfigSequenceButtonPress = class TransitionConfigSequenceButtonPress extends TransitionConfig {
	
	constructor(transition) {
		super(transition);
		this.validationRules.push(new SingleButtonPressValidationRule());
	}
	
	getNavigationListItem() {
		return {
			title : "Sequence Button Press",
			icon : "sap-icon://multiselect-none",
			selected : false,
			visible : true
		}
	}
	
	getNavigationContainerPage() {
		return {
			title : "Sequence Button Press",
			sequencePress : []
		}
	}
	
	getTransitionConfigFragment() {
		return sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransitionSequenceButtonPressConfig", this);
	}
	
	getActiveScopes() {
		var activeScopes = [];
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == "Sequence Button Press") {
					if(iconTabs[i].navigationContainerPages[n].sequencePress.length > 0) {
						activeScopes.push(iconTabs[i].scope);
					}
				}
			}
		}
		return activeScopes;
	}
	
	getFullyActiveScopes(neighborTransitions) {
		var scopeCollection = [];
		var activeScopes = [];
		return activeScopes;
	}
	
	setLoadData(loadData) {
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var key in loadData.sequenceButtonPresses) {
			for(var i = 0; i < iconTabs.length; i++) {
				if(key == iconTabs[i].scope) {
					for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
						if(iconTabs[i].navigationContainerPages[n].title == "Sequence Button Press") {
							for(var k = 0; k < loadData.sequenceButtonPresses[key].sequences.length; k++) {
								var buttons = [];
								for(var j = 0; j < loadData.sequenceButtonPresses[key].sequences[k].length; j++) {
									buttons.push({number : parseInt(loadData.sequenceButtonPresses[key].sequences[k].charAt(j))});
								}
								iconTabs[i].navigationContainerPages[n].sequencePress.push({buttons: buttons});
							}
						}
					}
				}
			}
		}
	}
	
	getSaveData() {
		var sequenceButtonPresses = {};
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == "Sequence Button Press") {
					var sequences = [];
					for(var k = 0; k < iconTabs[i].navigationContainerPages[n].sequencePress.length; k++) {
						var buttons = "";
						for(var j = 0; j < iconTabs[i].navigationContainerPages[n].sequencePress[k].buttons.length; j++) {
							buttons = buttons.concat(iconTabs[i].navigationContainerPages[n].sequencePress[k].buttons[j].number);
						}
						sequences.push(buttons);
					}
					sequenceButtonPresses[iconTabs[i].scope] = {
						sequences : sequences
					}
				}
			}
		}
		return {
			sequenceButtonPresses : sequenceButtonPresses
		};
	}
	
	onAfterRenderingDialog() {
		this.sequenceRefresh();
	}
	
	closeDialog() {
		this.dialog.close();
		this.dialog.destroy();
	}
	
	addSequence(oEvent) {
		//Create an instance of the dialog
		this.dialog = sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.SequenceButtonPress", this);
		
		//Set the model for the dialog
		this.dialog.setModel(new sap.ui.model.json.JSONModel({sequence : [{}]}));
		
		//Set the on after rendering
		this.dialog.onAfterRendering = $.proxy(this.onAfterRenderingSequence, this);
			
		//Open the dialog
		this.dialog.open();
		
		this.path23 = oEvent.getSource().getParent().getParent().getContent()[1].getBindingContext().getPath();
	}
	
	acceptSequence() {
		var sequence = $("#colorListSortable-listUl").sortable("toArray", { attribute: "class" });
		var data = this.transition.model.getProperty(this.path23 + "/sequencePress");
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
		if(buttonsArray.length == 0) {
			sap.m.MessageBox.information("Adding an empty sequence means the transition will occur if none of the defined sequences are input (i.e. wrong sequence).");
		}
		var sequenceValidation = new TransitionSequenceButtonPressValidationRule();
		if(!sequenceValidation.validate(this.transition, {buttons : buttonsArray}, this.transition.model.getProperty(this.path23).scope)) {
			sap.m.MessageBox.error("That sequence already exists in this scope (possibly in another neighbor transition)!");
		} else {
			data.push({buttons : buttonsArray});
			this.transition.model.setProperty(this.path23 + "/sequencePress", data);
			this.transition.onChange();
			this.sequenceRefresh();
		}
		this.closeDialog();
	}
	
	deleteSequence(oEvent) {
		this.deletePath = oEvent.getSource().getBindingContext().getPath();
		this.deleteSequencePath = oEvent.getSource().getParent().getParent().getBindingContext().getPath() + "/sequencePress";
		sap.m.MessageBox.confirm("Are you sure you want to delete this sequence?", {onClose : $.proxy(this.deleteOnClose, this)});
	}
	
	deleteOnClose(oEvent) {
		if(oEvent == "OK") {
			var splitPath = this.deletePath.split("/");
			var index = parseInt(splitPath[splitPath.length - 1]);
			var sequenceArray = this.transition.model.getProperty(this.deleteSequencePath);
			sequenceArray.splice(index, 1);
			this.transition.model.setProperty(this.deleteSequencePath, sequenceArray);
			this.transition.onChange();
			this.sequenceRefresh();
		} 
	}
	
	onAfterRenderingSequence(oEvent) {
		$("#colorListRed").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListGreen").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListBlue").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListBlack").draggable({revert: false, helper: "clone", connectToSortable : "#colorListSortable-listUl"});
		$("#colorListSortable-listUl").sortable();
	}
	
	sequenceRefresh() {
		var tabs = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems();
		for(var i = 0; i < tabs.length; i++) {
			var sequences = sap.ui.getCore().byId("outputStateDialog").getContent()[0].getItems()[i].getContent()[0].getContentAreas()[1].getPages()[1].getContent()[1].getItems()[0].getItems();
			for(var n = 0; n < sequences.length; n++) {
				var sequence = sequences[n].getContent()[0].getItems();
				for(var j = 0; j < sequence.length; j++) {
					var path = sequence[j].getBindingContext().getPath();
					var data = this.transition.model.getProperty(path);
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

var TransitionSequenceButtonPressValidationRule = class TransitionSequenceButtonPressValidationRule extends ValidationRule {
	
	validate(transition, sequence, scope) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.wlcpConnection.connectionFromState.htmlId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].wlcpConnection.connectionId) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			for(var n = 0; n < transitionList[i].modelJSON.iconTabs.length; n++) {
				if(scope == transitionList[i].modelJSON.iconTabs[n].scope) {
					if(this.containsSequence(sequence, transitionList[i].modelJSON.iconTabs[n].sequencePress)) {
						return false;
					}
				}
			}
		}
		
		return true;	
	}
	
	containsSequence(sequence, sequences) {
		for(var i = 0; i < sequences.length; i++) {
			if(sequences[i].buttons.length == sequence.buttons.length) {
				var equal = true;
				for(var n = 0; n < sequence.buttons.length; n++) {
					if(sequences[i].buttons[n].number != sequence.buttons[n].number) {
						equal = false;
						break;
					}
				}
				if(equal) {
					return true;
				}
			}
		}
		return false;
	}
}