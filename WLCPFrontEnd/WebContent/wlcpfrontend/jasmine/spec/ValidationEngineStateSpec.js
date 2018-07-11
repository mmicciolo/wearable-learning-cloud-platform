describe("A suite to test the Validation Engine State Functionality", function() {
	it("Single Connection No Transition Game Wide Active (Start)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(1);
	});
	
	it("Single Connection No Transition Team 1 Active (Start)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(8078);
	});
	
	it("Single Connection No Transition Team 1 Player 1 Active (Start)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(8188);
	});
	
	it("Single Connection No Transition All Teams Active (Start)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		
		outputState.onChange();
		
		expect(outputState.scopeMask).toEqual(14);
	});
	
	it("Single Connection No Transition All Players Active (Start)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
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
	
//	it("Single Connection No Transition Game Wide Active (Another State)", function() {
//		GameEditorTestingHelpers.resetGameEditor();
//		
//		var startState = GameEditorTestingHelpers.createNewGame();
//		var outputState = GameEditorTestingHelpers.addState(500, 250);
//		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
//		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
//		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
//		
//		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
//		
//		outputState.onChange();
//		outputState2.onChange();
//		
//		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 0xffffffff).toBeTruthy();
//	});
//	
//	it("Single Connection No Transition Team 1 Active (Another State)", function() {
//		GameEditorTestingHelpers.resetGameEditor();
//		
//		var startState = GameEditorTestingHelpers.createNewGame();
//		var outputState = GameEditorTestingHelpers.addState(500, 250);
//		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
//		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
//		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
//		
//		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
//		
//		outputState.onChange();
//		outputState2.onChange();
//		
//		expect(outputState.scopeMask == 8078 && outputState2.scopeMask == 2).toBeTruthy();
//	});
	
//	it("Multiple Connection No Transition Game Wide Active (Start)", function() {
//		GameEditorTestingHelpers.resetGameEditor();
//		
//		var startState = GameEditorTestingHelpers.createNewGame();
//		var outputState = GameEditorTestingHelpers.addState(500, 500);
//		var outputState2 = GameEditorTestingHelpers.addState(750, 500);
//		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
//		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
//		
//		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
//		
//		outputState.onChange();
//		
//		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 0).toBeTruthy();
//	});
});