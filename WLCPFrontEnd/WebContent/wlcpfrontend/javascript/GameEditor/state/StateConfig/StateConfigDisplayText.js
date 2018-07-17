var StateConfigDisplayText = class StateConfigDisplayText extends StateConfig {

	constructor(state) {
		super(state);
	}
	
	getNavigationListItem() {
		return {
			text : "Display Text",
			icon : "sap-icon://discussion-2"
		}
	}
	
	getNavigationContainerPage() {
		return {
			title : "Display Text",
			displayText : ""
		}
	}
	
	getStateConfigFragment() {
		return sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.States.OutputStateDisplayTextConfig", this);
	}
	
	getActiveScopes() {
		var activeScopes = [];
		var iconTabs = this.state.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == "Display Text") {
					if(iconTabs[i].navigationContainerPages[n].displayText != "") {
						activeScopes.push(iconTabs[i].scope);
					}
				}
			}
		}
		return activeScopes;
	}
	
	setLoadData(loadData) {
		var iconTabs = this.state.modelJSON.iconTabs;
		for(var key in loadData.displayText) {
			for(var i = 0; i < iconTabs.length; i++) {
				if(key == iconTabs[i].scope) {
					for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
						if(iconTabs[i].navigationContainerPages[n].title == "Display Text") {
							iconTabs[i].navigationContainerPages[n].displayText = loadData.displayText[key];
						}
					}
				}
			}
		}
	}
	
	getSaveData() {
		var outputStateData = {};
		var iconTabs = this.state.modelJSON.iconTabs;
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].title == "Display Text") {
					if(iconTabs[i].navigationContainerPages[n].displayText != "") {
						outputStateData[iconTabs[i].scope] = iconTabs[i].navigationContainerPages[n].displayText;
					}
				}
			}
		}
		return {
			displayText : outputStateData
		};
	}
}