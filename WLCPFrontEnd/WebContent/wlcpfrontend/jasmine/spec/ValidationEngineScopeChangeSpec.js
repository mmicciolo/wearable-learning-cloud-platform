describe("A suite to test different scope changes for states & transitions like Team -> Game Wide", function() {
	it("Single Connection No Transition Scope Change Game Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.onChange();

		expect(outputState.scopeMask).toEqual(8191);
	});
	it("Single Connection No Transition Game Wide Active Scope Change Game Wide -> Game Wide (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection No Transition Game Wide -> Team Wide (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask == 8078 && outputState2.scopeMask == 114).toBeTruthy();
	});
	it("Single Connection No Transition Player Wide -> Team Wide Same State Single Team (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[5].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[6].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask == 8188 && outputState2.scopeMask == 114).toBeTruthy();
	});
	it("Single Connection No Transition Player Wide -> Team Wide Different States Single Team (3x3)", function() {
		
	});
	it("Single Connection No Transition Team Wide -> Game Wide Same State (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask == 14 && outputState2.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection No Transition Team Wide -> Game Wide Different States (3x3)", function() {

	});
	it("Single Connection No Transition Player Wide -> Game Wide Same State (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
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
		
		expect(outputState.scopeMask == 8176 && outputState2.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection No Transition Player Wide -> Game Wide Different States (3x3)", function() {
		
	});
});