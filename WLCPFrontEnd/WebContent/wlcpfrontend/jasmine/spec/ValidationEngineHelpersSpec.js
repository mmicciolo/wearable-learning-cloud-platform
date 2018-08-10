describe("A suite to test the Validation Engine helpers", function() {
	it("Test getActiveScopes no active scopes", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		var activeScopes = ValidationEngineHelpers.getActiveScopesState(outputState);
		
		expect(activeScopes).toEqual([]);
	});
	it("Test getActiveScopes active scopes (Display Text)", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		var activeScopes = ValidationEngineHelpers.getActiveScopesState(outputState);
		
		expect(activeScopes).toEqual(["Game Wide"]);
	});
	it("Test getActiveScopesTransition no active scopes", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		var activeScopes = ValidationEngineHelpers.getActiveScopesTransition(transition);
		
		expect(activeScopes).toEqual([]);
	});
	it("Test getActiveScopesTransition active scopes (Single Button Press)", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		
		var activeScopes = ValidationEngineHelpers.getActiveScopesTransition(transition);

		expect(activeScopes).toEqual(["Game Wide"]);
	});
	it("Test getFullyActiveScopesTransition no active scopes", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		var activeScopes = ValidationEngineHelpers.getFullyActiveScopesTransition(transition, []);
		
		expect(activeScopes).toEqual([]);
	});
	it("Test getFullyActiveScopesTransition active scopes single transition (Single Button Press)", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(250, 500);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[2].selected = true;
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[3].selected = true;
		
		var activeScopes = ValidationEngineHelpers.getFullyActiveScopesTransition(transition, [transition2]);

		expect(activeScopes).toEqual(["Game Wide"]);
	});
	it("Test getFullyActiveScopesTransition active scopes multiple transition (3) (Single Button Press)", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(250, 500);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var outputState3 = GameEditorTestingHelpers.addState(750, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		var transition3 = GameEditorTestingHelpers.addTransition(connection3);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[2].selected = true;
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[3].selected = true;
		
		var activeScopes = ValidationEngineHelpers.getFullyActiveScopesTransition(transition3, [transition, transition2]);

		expect(activeScopes).toEqual(["Game Wide"]);
	});
	it("Test getFullyActiveScopesTransition active scopes multiple transition (3) check transition (Single Button Press)", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(250, 500);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var outputState3 = GameEditorTestingHelpers.addState(750, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		var transition3 = GameEditorTestingHelpers.addTransition(connection3);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[2].selected = true;
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[3].selected = true;
		
		transition2.onChange();
		
		var activeScopes = ValidationEngineHelpers.getFullyActiveScopesTransition(transition3, [transition, transition2]);

		expect(activeScopes.length == 1 && activeScopes.includes("Game Wide") && transition3.scopeMask == 0).toBeTruthy();
	});
	it("Test getActiveScopeMask Game Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Game Wide"]);
		expect(activeScopeMask).toEqual(1);
	});
	it("Test getActiveScopeMask Team Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Team 1"]);
		expect(activeScopeMask).toEqual(2);
	});
	it("Test getActiveScopeMask Player Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Team 1 Player 1"]);
		expect(activeScopeMask).toEqual(16);
	});
	it("Test getActiveScopeMask Team Wide Player Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Team 1", "Team 2 Player 1"]);
		expect(activeScopeMask).toEqual(130);
	});
	it("Test getActiveScopeMasks Game Wide (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 2);
		expect(activeScopeMasks).toEqual([8078]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 16);
		expect(activeScopeMasks).toEqual([8188]);
	});
	it("Test getActiveScopeMasks Team 1 Team 2 Player 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 130);
		expect(activeScopeMasks).toEqual([8078, 8186]);
	});
	it("Test getActiveScopeMasks Game Wide (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 2);
		expect(activeScopeMasks).toEqual([454]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 16);
		expect(activeScopeMasks).toEqual([508]);
	});
	it("Test getActiveScopeMasks Team 1 Team 2 Player 1 (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 130);
		expect(activeScopeMasks).toEqual([454, 506]);
	});
	it("Test getActiveScopeMasks Game Wide (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 2);
		expect(activeScopeMasks).toEqual([974]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 16);
		expect(activeScopeMasks).toEqual([1020]);
	});
	it("Test getActiveScopeMasks Team 1 Team 2 Player 1 (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 130);
		expect(activeScopeMasks).toEqual([974, 1018]);
	});
	it("Test getActiveScopeMasks Game Wide (1x1)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(1, 1, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (1x1)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(1, 1, 2);
		expect(activeScopeMasks).toEqual([2]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (1x1)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(1, 1, 4);
		expect(activeScopeMasks).toEqual([4]);
	});
	it("Test andActiveScopeMasks Team 1 Team 2 Player 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 130);
		var andActiveScopeMask = ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
		expect(andActiveScopeMask).toEqual(8074);
	});
	it("Test checkForScopeChanges Game Wide -> Game Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.checkForScopeChanges(3, 3, 1);
		expect(activeScopeMask).toEqual(8191);
	});
	it("Test checkForScopeChanges Game Wide -> Team Wide (make sure it has team + players for that team) (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.checkForScopeChanges(3, 3, 2);
		expect(activeScopeMask).toEqual(114);
	});
	it("Test checkForScopeChanges Player Wide -> Team Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.checkForScopeChanges(3, 3, 112);
		expect(activeScopeMask).toEqual(114);
	});
	
	it("Test checkForScopeChanges Team -> Game Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.checkForScopeChanges(3, 3, 14);
		expect(activeScopeMask).toEqual(8191);
	});
	it("Test checkForScopeChanges Player Wide -> Game Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.checkForScopeChanges(3, 3, 8176);
		expect(activeScopeMask).toEqual(8191);
	});
});