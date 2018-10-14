var TransitionValidationRule = class TransitionValidationRule extends ValidationRule {
	
	validate(transition, updateNeighbors = true, revalidate = false) {
		
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
				var activeScopes = ValidationEngineHelpers.getActiveScopesState(transition.connection.connectionFrom.outputConnections[i].connectionTo);

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

		//And the active scope mask together
		var andScopeMasks = ValidationEngineHelpers.checkForReverseScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, parentMask, ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks));
		
		//And all of the masks together to get our new scope mask
		parentMask = parentMask & andScopeMasks;
		
		//Set the transitions scope
		transition.setScope(parentMask & (~neighborMask) & (~stateNeighborMask), GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		
		if(revalidate) {
			if(!transition.connection.isLoopBack) {
				//Update the state below us
				transition.connection.connectionTo.validationRules[0].validate(transition.connection.connectionTo, updateNeighbors, revalidate);
			}
			
			if(updateNeighbors) {
				for(var i = 0; i < neighborTransitions.length; i++) {
					if(neighborTransitions[i].overlayId != transition.overlayId) {
						this.validate(neighborTransitions[i], false, revalidate);
					}
				}
			}
			
			if(updateNeighbors) {
				//If the transition is a loopback Revalidate our neighbors states but make sure they dont revalidate their neighbors
				if(transition.connection.isLoopBack) {
					for(var i = 0; i < transition.connection.connectionFrom.outputConnections.length; i++) {
						if(transition.connection.connectionFrom.outputConnections[i].transition == null) {
							transition.connection.connectionFrom.outputConnections[i].connectionTo.validationRules[0].validate(transition.connection.connectionFrom.outputConnections[i].connectionTo,false,revalidate);
						}
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