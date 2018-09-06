var TransitionConfig = class TransitionConfig {

	constructor(transition) {
		this.transition = transition;
		this.validationRules = [];
	}
	
	onChange(oEvent) {
		this.transition.onChange(oEvent);
		for(var i = 0; i < this.validationRules.length; i++) {
			this.validationRules[i].validate(this.transition);
		}
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