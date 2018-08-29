describe("A suite to test the Validation Engine Loop Back Mechanisms for both states and transitions", function() {
	it("Self Loopback No Transition No State Below (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();

		expect(outputState.scopeMask).toEqual(1);
	});
	it("Self Loopback No Transition State Below (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var outputState2 = GameEditorTestingHelpers.addState(750, 550);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 0).toBeTruthy();
	});
	it("Loopback No Transition (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		

		expect(outputState2.scopeMask).toEqual(8191);
	});
});