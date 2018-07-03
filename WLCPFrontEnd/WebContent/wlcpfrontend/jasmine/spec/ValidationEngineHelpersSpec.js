describe("A suite to test the Validation Engine helpers", function() {
	it("Test getActiveScopes no active scopes", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		var activeScopes = outputState.getActiveScopes();
		
		expect(activeScopes).toEqual([]);
	});
	it("Test getActiveScopes active scopes", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		var activeScopes = outputState.getActiveScopes();
		
		expect(activeScopes).toEqual(["Game Wide"]);
	});
});