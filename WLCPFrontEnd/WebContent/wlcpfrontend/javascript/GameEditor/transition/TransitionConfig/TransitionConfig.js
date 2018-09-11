var TransitionConfig = class TransitionConfig {

	constructor(transition) {
		this.transition = transition;
		this.validationRules = [];
		this.validationRules.push(new TransitionSelectedTypeValidationRule());
	}
	
	onChange(oEvent) {
		this.transition.onChange(oEvent);
		for(var i = 0; i < this.validationRules.length; i++) {
			this.validationRules[i].validate(this.transition);
		}
	}
	
	getNavigationListItem() {
		return {
			title : "",
			icon : ""
		}
	}
	
	getNavigationContainerPage() {
		return {
			title : ""
		}
	}
	
	getTransitionConfigFragment() {
		return null;
	}
	
	getActiveScopes() {
		return [];
	}
	
	getFullyActiveScopes(neighborTransitions) {
		return [];
	}
	
	setLoadData(loadData) {
		
	}
	
	getSaveData() {
		return {};
	}
	
	onAfterRenderingDialog() {
		
	}
	
}

var TransitionSelectedTypeValidationRule = class TransitionSelectedTypeValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.connectionFrom.htmlId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.connectionId) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			var scopes = transitionList[i].modelJSON.iconTabs;
			for(var n = 0; n < scopes.length; n++) {
				var activeList = [];
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							activeList.push(this.getActiveTransitionType(transitionList[j], scopes[n].scope));
						}
					}
				}
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						var transitionTypes = transitionList[j].modelJSON.iconTabs[k].navigationListItems;
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							for(var l = 0; l < transitionTypes.length; l++) {
								if(activeList.includes("") && !activeList.includes("Single Button Press") && !activeList.includes("Sequence Button Press") && !activeList.includes("Keyboard Input")) {
									transitionTypes[l].visible = true;
								} else if(activeList.includes(transitionTypes[l].title)) {
									transitionTypes[l].visible = true;
									transitionList[j].modelJSON.iconTabs[k].activeTransition = transitionTypes[l].title;
								} else {
									transitionTypes[l].visible = false;
								}
							}
							transitionList[j].model.setData(transitionList[j].modelJSON);
						}
					}
				}
			}
		}
	}
	
	getActiveTransitionType(transition, scope) {
		var iconTabs = transition.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			if(iconTabs[i].scope == scope) {
				for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
					if(iconTabs[i].navigationContainerPages[n].title == "Single Button Press") {
						if(iconTabs[i].navigationContainerPages[n].singlePress[0].selected || iconTabs[i].navigationContainerPages[n].singlePress[1].selected || 
							iconTabs[i].navigationContainerPages[n].singlePress[2].selected || iconTabs[i].navigationContainerPages[n].singlePress[3].selected) {
							return "Single Button Press";
						}
					} else if(iconTabs[i].navigationContainerPages[n].title == "Sequence Button Press") {
						if(iconTabs[i].navigationContainerPages[n].sequencePress.length > 0) { 
							return "Sequence Button Press";
						}
					} else if(iconTabs[i].navigationContainerPages[n].title == "Keyboard Input") {
						if(iconTabs[i].navigationContainerPages[n].keyboardField.length > 0) {
							return "Keyboard Input";
						}
					}
				}
			}
		}
		return "";
	}
}