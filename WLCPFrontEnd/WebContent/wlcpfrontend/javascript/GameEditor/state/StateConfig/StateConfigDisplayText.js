var StateConfigDisplayText = class StateConfigDisplayText extends StateConfig {

	constructor() {
		var JSONModel = {
			displayText : new Array(12),
			index : 0
		}
		super("DisplayText", new sap.ui.model.json.JSONModel(JSONModel));
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
	
	setLoadData(loadData, iconTabs) {
		for(var key in loadData.displayText) {
			for(var i = 0; i < iconTabs.length; i++) {
				if(key == iconTabs[i].scope) {
					for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
						if(iconTabs[i].navigationContainerPages[n].text = "Display Text") {
							iconTabs[i].navigationContainerPages[n].displayText = loadData.displayText[key];
						}
					}
				}
			}
		}
	}
	
	getSaveData(iconTabs) {
		var outputStateData = {};
		for(var i = 0; i < iconTabs.length; i++) {
			for(var n = 0; n < iconTabs[i].navigationContainerPages.length; n++) {
				if(iconTabs[i].navigationContainerPages[n].text = "Display Text") {
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