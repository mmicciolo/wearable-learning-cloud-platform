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
	it("State To Transition Revalidation No Loopbacks (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();

		expect(outputState.scopeMask == 8078 && transition.scopeMask == 114).toBeTruthy();
	});
	it("Transition to State Revalidation No Loopbacks (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		expect(transition.scopeMask ==1 && outputState.scopeMask == 8191).toBeTruthy();
	});
	it("State Neighbors Revalidation No Loopbacks (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(250, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 250);
		var outputState3 = GameEditorTestingHelpers.addState(750, 250);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		outputState3.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState3.onChange();
		
		expect(outputState.scopeMask == 2 && outputState2.scopeMask == 4 && outputState3.scopeMask == 8).toBeTruthy();
	});
	it("Transition Neighbors Revalidation No Loopbacks (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(250, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 250);
		var outputState3 = GameEditorTestingHelpers.addState(750, 250);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		var transition3 = GameEditorTestingHelpers.addTransition(connection3);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition2.onChange();
		
		transition3.modelJSON.iconTabs[2].navigationContainerPages[0].singlePress[0].selected = true;
		transition3.onChange();
		
		expect(transition.scopeMask == 14 && transition2.scopeMask == 14 && transition3.scopeMask == 14).toBeTruthy();
	});
	it("State to State Revalidation Loopback Without Transition (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		expect(outputState.scopeMask == 8078 && outputState2.scopeMask == 0).toBeTruthy();
	});
	it("State to State Revalidation Loopback With Transition (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection3);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		expect(outputState.scopeMask == 7182 && transition.scopeMask == 902 && outputState2.scopeMask == 900).toBeTruthy();
	});
	it("Connection Dropped (3x3)", function() {
		
	});
	it("Connection Removed (3x3)", function() {
		
	});
});