describe("A suite to test the Validation Engine State Functionality", function() {
		
	it("Single Connection No Transition Game Wide Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(1);
	});
	
	it("Single Connection No Transition Team 1 Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(8078);
	});
	
	it("Single Connection No Transition Team 1 Player 1 Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(8188);
	});
	
	it("Single Connection No Transition All Teams Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(14);
	});
	
	it("Single Connection No Transition All Players Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
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
		
		expect(outputState.scopeMask).toEqual(8176);
	});
	
	it("Single Connection No Transition Game Wide Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";

		outputState2.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 1).toBeTruthy();
	});
	
	it("Single Connection No Transition Team 1 Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";

		outputState2.onChange();
		
		expect(outputState.scopeMask = 1 && outputState2.scopeMask == 8078).toBeTruthy();
	});
	
	it("Single Connection No Transition Team 1 Player 1 Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";

		outputState2.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 8188).toBeTruthy();
	});
	
	it("Single Connection No Transition All Teams Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";

		outputState2.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 14).toBeTruthy();
	});
	
	it("Single Connection No Transition All Players Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[5].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[6].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[7].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[8].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[9].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[10].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[11].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.modelJSON.iconTabs[12].navigationContainerPages[0].displayText = "Hello World!";

		outputState2.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 8176).toBeTruthy();
	});
});