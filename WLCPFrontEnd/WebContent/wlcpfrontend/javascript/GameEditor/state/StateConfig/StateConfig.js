var StateConfig = class StateConfig {

	constructor(state) {
		this.state = state;
	}
	
	onChange(oEvent) {
		this.state.onChange(oEvent);
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