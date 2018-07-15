var TransitionConfig = class TransitionConfig {

	constructor(transition) {
		this.transition = transition;
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
}