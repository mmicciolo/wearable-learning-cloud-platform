var StateScopeValidationRule = class StateScopeValidationRule extends ValidationRule {

	validate(state) {
	
		var nonTransitionMask = 0;
		
		//Loop through the parent states
		for(var i = 0; i < state.inputConnections.length; i++) {
			//Get the active scopes
			var activeScopes = ValidationEngineHelpers.getActiveScopes(state.inputConnections[i].connectionFromState);
			
			//Get the active scope mask
			var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
			
			nonTransitionMask = nonTransitionMask | activeScopeMask;
		}
		
		var parentMask = nonTransitionMask;
		
		parentMask = ValidationEngineHelpers.checkForScopeChanges(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, parentMask);
		
		//Get the active scopes
		var activeScopes = ValidationEngineHelpers.getActiveScopes(state);
		
		//Get the active scope mask
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopes);
		
		//Get the active scope masks
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam, activeScopeMask);
		
		//And the active scope mask together
		var andScopeMasks = ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
		
		state.setScope(parentMask & andScopeMasks, GameEditor.getEditorController().gameModel.TeamCount, GameEditor.getEditorController().gameModel.PlayersPerTeam);
	}

}