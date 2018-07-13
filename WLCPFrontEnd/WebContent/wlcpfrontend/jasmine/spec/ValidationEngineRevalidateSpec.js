describe("A suite to test revalidation of states & transitions when onChange is called", function() {
	it("State to State Revalidation No Loopbacks (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState2.scopeMask).toEqual(8191);
	});
	it("State Neighbors Revalidation No Loopbacks (3x3)", function() {

	});
	it("State to State Revalidation Loopbacks (3x3)", function() {
		
	});
	it("Connection Dropped (3x3)", function() {
		
	});
	it("Connection Removed (3x3)", function() {
		
	});
});