describe("A suite to test different reverse scope changes for states & transitions like Team -> Game Wide", function() {
	it("Single Connection No Transition Reverse Scope Change Team Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "";
		outputState.onChange();
		
		expect(outputState.scopeMask == 126 && outputState2.scopeMask == 8076).toBeTruthy();
	});
	it("Single Connection No Transition Reverse Scope Change Player Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[5].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[6].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[7].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[8].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[9].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[10].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[11].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[12].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "";
		outputState.onChange();
		
		expect(outputState.scopeMask == 8176 && outputState2.scopeMask == 8172).toBeTruthy();
	});
	it("Single Connection No Transition Reverse Scope Change Team Wide and Player Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[7].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[8].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[9].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[10].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[11].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[12].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "";
		outputState.onChange();
		
		expect(outputState.scopeMask == 8178 && outputState2.scopeMask == 8076).toBeTruthy();
	});
	it("Single Connection Transition On Top Reverse Scope Change Team Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[2].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[3].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = false;
		transition.onChange();
		
		expect(outputState.scopeMask == 8076 && transition.scopeMask == 126).toBeTruthy();
	});
	it("Single Connection Transition On Top Reverse Scope Change Player Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[4].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[5].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[6].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[7].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[8].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[9].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[10].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[11].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[12].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = false;
		transition.onChange();
		
		expect(outputState.scopeMask == 8172 && transition.scopeMask == 8176).toBeTruthy();
	});
	it("Single Connection Transition On Top Reverse Scope Change Player Wide and Team Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[7].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[8].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[9].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[10].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[11].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[12].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = false;
		transition.onChange();
		
		expect(outputState.scopeMask == 8076 && transition.scopeMask == 8178).toBeTruthy();
	});
	it("Single Connection Transition On Bottom Reverse Scope Change Team Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();

		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "";
		outputState.onChange();
		
		expect(outputState.scopeMask == 126 && transition.scopeMask == 8076).toBeTruthy();
	});
	it("Single Connection Transition On Bottom Reverse Scope Change Player Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[5].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[6].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[7].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[8].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[9].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[10].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[11].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[12].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();

		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "";
		outputState.onChange();
		
		expect(outputState.scopeMask == 8176 && transition.scopeMask == 8172).toBeTruthy();
	});
	it("Single Connection Transition On Bottom Reverse Scope Change Team Wide and Player Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[7].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[8].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[9].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[10].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[11].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[12].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();

		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "";
		outputState.onChange();
		
		expect(outputState.scopeMask == 8178 && transition.scopeMask == 8076).toBeTruthy();
	});
});