var StateScopeValidationRule = class StateScopeValidationRule extends ValidationRule {

	validate(state, updateNeighbors = true) {
	
		var parentMask = 0;
		
		//Loop through the parent states
		for(var i = 0; i < state.inputConnections.length; i++) {
			//Get the active scopes
			var activeScopes = ValidationEngineHelpers.getActiveScopes(state.inputConnections[i].connectionFromState);
			
			//Get the active scope mask
			var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
			
			parentMask = parentMask | activeScopeMask;
		}
		
		parentMask = ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, parentMask);
		
		var neighborMask = 0;
		
		//Loop through the neighbor states
		for(var i = 0; i < state.inputConnections.length; i++) {
			for(var n = 0; n < state.inputConnections[i].connectionFromState.outputConnections.length; n++) {
				if(state.inputConnections[i].connectionFromState.outputConnections[n].connectionToState.htmlId != state.htmlId) {
					//Get the active scopes
					var activeScopes = ValidationEngineHelpers.getActiveScopes(state.inputConnections[i].connectionFromState.outputConnections[n].connectionToState);
					
					//Get the active scope mask
					var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
					
					var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
					
					var notActiveScopeMasks = ~ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
					
					neighborMask = neighborMask | (activeScopeMask | notActiveScopeMasks);
				}
			}
		}
		
		//Get the active scopes
		var activeScopes = ValidationEngineHelpers.getActiveScopes(state);
		
		//Get the active scope mask
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
		
		//Get the active scope masks
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
		
		//And the active scope mask together
		var andScopeMasks = ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
		
		state.setScope(parentMask & andScopeMasks & (~neighborMask), GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
		
		//Recursively revalidate the states below us
		for(var i = 0; i < state.outputConnections.length; i++) {
			//Ignore loop backs
			if(!state.outputConnections[i].isLoopBack) {
				this.validate(state.outputConnections[i].connectionToState, true)
			}
		}
		
		//Revalidate our neighbors but make sure they dont revalidate their neighbors
		if(updateNeighbors) {
			for(var i = 0; i < state.inputConnections.length; i++) {
				for(var n = 0; n < state.inputConnections[i].connectionFromState.outputConnections.length; n++) {
					if(state.inputConnections[i].connectionFromState.outputConnections[n].connectionToState.htmlId != state.htmlId) {
						this.validate(state.inputConnections[i].connectionFromState.outputConnections[n].connectionToState, false);
					}
				}
			}
		}
	}

}