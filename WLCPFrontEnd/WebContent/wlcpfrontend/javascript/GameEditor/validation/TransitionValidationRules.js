var TransitionValidationRule = class TransitionValidationRule extends ValidationRule {
	
	validate(transition, updateNeighbors = true) {
		
		var parentMask = 0;
		
		var state = transition.connection.connectionFrom;
		
		//Get the active scopes
		var activeScopes = ValidationEngineHelpers.getActiveScopesState(state);
		
		//Get the active scope mask
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
		
		parentMask = parentMask | activeScopeMask;
		
		parentMask = ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, parentMask);
		
		var neighborTransitions = [];
		
		for(var i = 0; i < state.outputConnections.length; i++) {
			if(state.outputConnections[i].transition != null) {
				neighborTransitions.push(state.outputConnections[i].transition);
			}
		}
		
		var orMaskAll = 0;
		
		//Loop through and or all active masks that have the same parent
		for(var i = 0; i < neighborTransitions.length; i++) {
			
			//Get the active scopes
			var activeScopes = ValidationEngineHelpers.getActiveScopesTransition(neighborTransitions[i]);
			
			//Get the active scope mask
			var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
			
			orMaskAll = orMaskAll | activeScopeMask;
		}
		
		var stateNeighborMask = 0;
		
		for(var i = 0; i < transition.connection.connectionFrom.outputConnections.length; i++) {
			if(transition.connection.connectionFrom.outputConnections[i].transition == null) {
				var activeScopes = ValidationEngineHelpers.getActiveScopesState(transition.connection.connectionFrom.outputConnections[i].connectionTo.htmlId);

				var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
				
				var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
				
				var notActiveScopeMasks = ~ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
				
				stateNeighborMask = stateNeighborMask | (activeScopeMask | notActiveScopeMasks);
			}
		}
		
		var neighborMask = 0;

		//Get the active scopes
		var activeScopes = ValidationEngineHelpers.getFullyActiveScopesTransition(transition, neighborTransitions);
		
		//Get the active scope mask
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
		
		neighborMask = neighborMask | activeScopeMask;	
		
		//Get the active scope masks
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, orMaskAll);

		//And all of the masks together to get our new scope mask
		parentMask = parentMask & ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
		
		//Set the transitions scope
		transition.setScope(parentMask & (~neighborMask) & (~stateNeighborMask), GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		
		if(!transition.connection.isLoopBack) {
			//Update the state below us
			transition.connection.connectionTo.validationRules[0].validate(transition.connection.connectionTo, updateNeighbors);
		}
		
		if(updateNeighbors) {
			for(var i = 0; i < neighborTransitions.length; i++) {
				if(neighborTransitions[i].overlayId != transition.overlayId) {
					this.validate(neighborTransitions[i], false);
				}
			}
		}
		
		if(updateNeighbors) {
			//If the transition is a loopback Revalidate our neighbors states but make sure they dont revalidate their neighbors
			if(transition.connection.isLoopBack) {
				for(var i = 0; i < transition.connection.connectionFrom.outputConnections.length; i++) {
					if(transition.connection.connectionFrom.outputConnections[i].transition == null) {
						transition.connection.connectionFrom.outputConnections[i].connectionTo.validationRules[0].validate(transition.connection.connectionFrom.outputConnections[i].connectionTo,false);
					}
				}
			}
		}
	}
	
	setScopeData(transition, model) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == model.scope) {
				transition.modelJSON.iconTabs[i] = model;
				transition.model.setData(transition.modelJSON);
				break;
			}
		}
	}
	
	getTab(transition, scope) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == scope) {
				return transition.modelJSON.iconTabs[i];
			}
		}
		return null;
	}
}

var TransitionSelectedTypeValidationRule = class TransitionSelectedTypeValidationRule extends ValidationRule {
	
	validate(transition) {
		
		var transitionList = [];
		
		//Get a list of neighbor connections
		var neighborConnections = GameEditor.getJsPlumbInstance().getConnections({source : transition.connection.connectionFrom.htmlId});
		
		//Loop through the neighbor connections
		for(var i = 0; i < neighborConnections.length; i++) {
			for(var n = 0; n < GameEditor.getEditorController().transitionList.length; n++) {
				if(neighborConnections[i].id == GameEditor.getEditorController().transitionList[n].connection.connectionId) {
					transitionList.push(GameEditor.getEditorController().transitionList[n]);
				}
			}
		}
		
		//Loop through the transition list
		for(var i = 0; i < transitionList.length; i++) {
			var scopes = transitionList[i].modelJSON.iconTabs;
			for(var n = 0; n < scopes.length; n++) {
				var activeList = [];
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							activeList.push(this.getActiveTransitionType(transitionList[j], scopes[n].scope));
						}
					}
				}
				for(var j = 0; j < transitionList.length; j++) {
					for(var k = 0; k < transitionList[j].modelJSON.iconTabs.length; k++) {
						var transitionTypes = transitionList[j].modelJSON.iconTabs[k].transitionTypes;
						if(scopes[n].scope == transitionList[j].modelJSON.iconTabs[k].scope) {
							for(var l = 0; l < transitionTypes.length; l++) {
								if(activeList.includes("") && !activeList.includes("Single Button Press") && !activeList.includes("Sequence Button Press") && !activeList.includes("Keyboard Input")) {
									transitionTypes[l].visible = true;
								} else if(activeList.includes(transitionTypes[l].title)) {
									transitionTypes[l].visible = true;
									transitionList[j].modelJSON.iconTabs[k].activeTransition = transitionTypes[l].title;
								} else {
									transitionTypes[l].visible = false;
								}
							}
							transitionList[j].model.setData(transitionList[j].modelJSON);
						}
					}
				}
			}
		}
	}
	
	getActiveTransitionType(transition, scope) {
		for(var i = 0; i < transition.modelJSON.iconTabs.length; i++) {
			if(transition.modelJSON.iconTabs[i].scope == scope) {
				if(transition.modelJSON.iconTabs[i].singlePress[0].selected || transition.modelJSON.iconTabs[i].singlePress[1].selected || 
				    transition.modelJSON.iconTabs[i].singlePress[2].selected || transition.modelJSON.iconTabs[i].singlePress[3].selected) {
					return "Single Button Press";
				} else if(transition.modelJSON.iconTabs[i].sequencePress.length > 0) {
					return "Sequence Button Press";
				} else if(transition.modelJSON.iconTabs[i].keyboardField.length > 0) {
					return "Keyboard Input";
				}
			}
		}
		return "";
	}
}