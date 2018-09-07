var TransitionConfigSingleButtonPress = class TransitionConfigSingleButtonPress extends TransitionConfig {
	
	constructor(transition) {
		super(transition);
		this.validationRules.push(new SingleButtonPressValidationRule());
	}
	
	getNavigationListItem() {
		return {
			title : "Single Button Press",
			icon : "sap-icon://touch",
			selected : true,
			visible : true
		}
	}
	
	getNavigationContainerPage() {
		return {
			title : "Single Button Press",
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
			}]
		}
	}
	
	getTransitionConfigFragment() {
		return sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.Transitions.InputTransitionSingleButtonPressConfig", this);
	}
	
	getActiveScopes() {
		var activeScopes = [];
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == "Single Button Press") {
					if(iconTabs[i].navigationContainerPages[n].singlePress[0].selected || iconTabs[i].navigationContainerPages[n].singlePress[1].selected || 
				       iconTabs[i].navigationContainerPages[n].singlePress[2].selected || iconTabs[i].navigationContainerPages[n].singlePress[3].selected) {
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
		for(var i = 0; i < neighborTransitions.length; i++) {
			if(this.transition.overlayId != neighborTransitions[i].overlayId) {
				for(var n = 0; n < neighborTransitions[i].modelJSON.iconTabs.length; n++) {
					scopeCollection.push({transition : neighborTransitions[i], model : neighborTransitions[i].modelJSON.iconTabs[n]});
				}
			}
		}
		for(var i = 0; i < scopeCollection.length; i++) {
			var buttonsChecked = 0;
			for(var n = 0; n < scopeCollection.length; n++) {
				if((scopeCollection[i].model.scope == scopeCollection[n].model.scope) && !activeScopes.includes(scopeCollection[i].model.scope)) {
					for(var button = 0; button < 4; button++) {
						for(var j = 0; j < scopeCollection[n].model.navigationContainerPages.length; j++) {
							if(scopeCollection[n].model.navigationContainerPages[j].title == "Single Button Press") {
								if(scopeCollection[n].model.navigationContainerPages[j].singlePress[button].selected) {buttonsChecked++;}
							}
						}
					}
				}
			}
			if(buttonsChecked == 4) { 
				activeScopes.push(scopeCollection[i].model.scope); 
			}
		}
		
		return activeScopes;
	}
	
	setLoadData(loadData) {
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var key in loadData.singleButtonPresses) {
			for(var i = 0; i < iconTabs.length; i++) {
				if(key == iconTabs[i].scope) {
					for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
						if(iconTabs[i].navigationContainerPages[n].title == "Single Button Press") {
							iconTabs[i].navigationContainerPages[n].singlePress[0].selected = loadData.singleButtonPresses[key].button1;
							iconTabs[i].navigationContainerPages[n].singlePress[1].selected = loadData.singleButtonPresses[key].button2;
							iconTabs[i].navigationContainerPages[n].singlePress[2].selected = loadData.singleButtonPresses[key].button3;
							iconTabs[i].navigationContainerPages[n].singlePress[3].selected = loadData.singleButtonPresses[key].button4;
						}
					}
				}
			}
		}
	}
	
	getSaveData() {
		var singleButtonPresses = {};
		var iconTabs = this.transition.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == "Single Button Press") {
					if(iconTabs[i].navigationContainerPages[n].singlePress[0].selected || iconTabs[i].navigationContainerPages[n].singlePress[1].selected
					 ||iconTabs[i].navigationContainerPages[n].singlePress[2].selected || iconTabs[i].navigationContainerPages[n].singlePress[3].selected) {
						singleButtonPresses[iconTabs[i].scope] = {
							button1 : iconTabs[i].navigationContainerPages[n].singlePress[0].selected,
							button2 : iconTabs[i].navigationContainerPages[n].singlePress[1].selected,
							button3 : iconTabs[i].navigationContainerPages[n].singlePress[2].selected,
							button4 : iconTabs[i].navigationContainerPages[n].singlePress[3].selected
						}
					}
				}
			}
		}
		return {
			singleButtonPresses : singleButtonPresses
		};
	}
	
}

var SingleButtonPressValidationRule = class SingleButtonPressValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var state = transition.connection.connectionFrom;
		
		var transitionList = [];
		
		for(var i = 0; i < state.outputConnections.length; i++) {
			if(state.outputConnections[i].transition != null) {
				transitionList.push(state.outputConnections[i].transition);
			}
		}
		
		for(var i = 0; i < transitionList.length; i++) {
			
			var scopeCollection = [];
			for(var n = 0; n < transitionList.length; n++) {
				if(transitionList[i].overlayId != transitionList[n].overlayId) {
					for(var j = 0; j < transitionList[n].modelJSON.iconTabs.length; j++) {
						scopeCollection.push({transition : transitionList[n], model : transitionList[n].modelJSON.iconTabs[j]});
					}
				}
			}

			for(var button = 0; button < 4; button++) {
				for(var n = 0; n < scopeCollection.length; n++) {
					var selected = false;
					for(var j = 0; j < scopeCollection.length; j++) {
						if(scopeCollection[n].model.scope == scopeCollection[j].model.scope) {
							for(var k = 0; k < scopeCollection[j].model.navigationContainerPages.length; k++) {
								if(scopeCollection[j].model.navigationContainerPages[k].title == "Single Button Press") {									
									if(scopeCollection[j].model.navigationContainerPages[k].singlePress[button].selected) {
										selected = true;
									}
								}
							}
						}
					}
					var trans = this.getTab(transitionList[i], scopeCollection[n].model.scope);
					if(trans != null) {
						trans.singleButtonPress.singlePress[button].enabled = !selected;
						this.setScopeData(transitionList[i], trans.iconTab);
					}
				}
			}
			
			if(scopeCollection.length == 0 ) {
				for(var j = 0; j < transitionList[0].modelJSON.iconTabs.length; j++) {
					var trans = this.getTab(transitionList[0], transitionList[0].modelJSON.iconTabs[j].scope);
					for(var button = 0; button < 4; button++) {
						trans.singleButtonPress.singlePress[button].enabled = true;
					}
					this.setScopeData(transitionList[0], trans.iconTab);
				}
			}
		}
	}
	
	getTab(transition, scope) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == scope) {
				for(var n = 0; n < transition.modelJSON.iconTabs[i].navigationContainerPages.length; n++) {
					if(transition.modelJSON.iconTabs[i].navigationContainerPages[n].title == "Single Button Press") {
						return { iconTab : transition.modelJSON.iconTabs[i], singleButtonPress :  transition.modelJSON.iconTabs[i].navigationContainerPages[n]}
					}
				}
			}
		}
		return null;
	}
	
	setScopeData(transition, model) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == model.scope) {
				transition.modelJSON.iconTabs[i] = model;
				transition.model.setData(transition.modelJSON);
				break;
			}
		}
	}
}