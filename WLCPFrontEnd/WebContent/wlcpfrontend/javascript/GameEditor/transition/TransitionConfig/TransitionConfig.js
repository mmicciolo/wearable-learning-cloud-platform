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
	
	setLoadData(loadData) {
		
	}
	
	getSaveData() {
		return {};
	}
}