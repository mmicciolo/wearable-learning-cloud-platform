describe("A suite to test the Validation Engine Transition Functionality", function() {
	it("Single Connection Single Transition Nothing Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);

		transition.onChange()
		
		expect(outputState.scopeMask == 0 && transition.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transition Nothing Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);

		transition.onChange();

		expect(outputState.scopeMask == 8191 && transition.scopeMask == 0 && outputState2.scopeMask == 0).toBeTruthy();
	});
	it("Single Connection Single Transition Game Wide Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		expect(transition.scopeMask == 1 && outputState.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transition Team 1 Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		expect(transition.scopeMask == 8078 && outputState.scopeMask == 114).toBeTruthy();
	});
	it("Single Connection Single Transition Team 1 Player 1 Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[4].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		expect(transition.scopeMask == 8188 && outputState.scopeMask == 16).toBeTruthy();
	});
	it("Single Connection Single Transition All Teams Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[2].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[3].navigationContainerPages[0].singlePress[0].selected = true;
		
		transition.onChange();
		
		expect(transition.scopeMask == 14 && outputState.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transitions All Players Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
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
		
		expect(transition.scopeMask == 8176 && outputState.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transition Game Wide Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && transition.scopeMask == 1 && outputState2.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transition Team 1 Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && transition.scopeMask == 8078 && outputState2.scopeMask == 114).toBeTruthy();
	});
	it("Single Connection Single Transition Team 1 Player 1 Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[4].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && transition.scopeMask == 8188 && outputState2.scopeMask == 16).toBeTruthy();
	});
	it("Single Connection Single Transition All Teams Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[2].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[3].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && transition.scopeMask == 14 && outputState2.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transition All Players Active (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
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

		expect(outputState.scopeMask == 1 && transition.scopeMask == 8176 && outputState2.scopeMask == 8191).toBeTruthy();
	});
	
	it("Single Connection Single Transition Random Active In Parent (Another State) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState2.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[2].navigationContainerPages[0].singlePress[0].selected = true;
		transition.modelJSON.iconTabs[12].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask == 1 && transition.scopeMask == 7174 && outputState2.scopeMask == 5110).toBeTruthy();
	});
});