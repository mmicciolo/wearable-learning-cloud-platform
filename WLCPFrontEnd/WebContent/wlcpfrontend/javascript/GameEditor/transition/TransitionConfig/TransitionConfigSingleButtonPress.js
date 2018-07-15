var TransitionConfigSingleButtonPress = class TransitionConfigSingleButtonPress extends TransitionConfig {
	
	constructor(transition) {
		super(transition);
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
				if(iconTabs[i].navigationContainerPages[n].text = "Single Button Press") {
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
						for(var j = 0; j < scopeCollection[i].model.navigationContainerPages.length; j++) {
							if(scopeCollection[i].model.navigationContainerPages[j].text = "Single Button Press") {
								if(scopeCollection[i].model.navigationContainerPages[j].singlePress[button].selected) {buttonsChecked++;}
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
						if(iconTabs[i].navigationContainerPages[n].text = "Single Button Press") {
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
				if(iconTabs[i].navigationContainerPages[n].title = "Single Button Press") {
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