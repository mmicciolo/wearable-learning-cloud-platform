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