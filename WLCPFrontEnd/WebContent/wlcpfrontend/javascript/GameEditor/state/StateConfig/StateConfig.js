var StateConfig = class StateConfig {

	constructor(modelName, model) {
		this.modelName = modelName;
		this.model = model
	}
	
	getNavigationListItem() {
		return {
			text : "",
			icon : ""
		}
	}
	
	getNavigationContainerPage() {
		return {
			title : ""
		}
	}
	
	getStateConfigFragment() {
		return null;
	}
	
	setLoadData(loadData, iconTabs) {
		
	}
	
	getSaveData(iconTabs) {
		return {};
	}
}