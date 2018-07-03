var StateConfig = class StateConfig {

	constructor(state) {
		this.state = state;
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
	
	getActiveScopes() {
		return [];
	}
	
	setLoadData(loadData) {
		
	}
	
	getSaveData() {
		return {};
	}
}