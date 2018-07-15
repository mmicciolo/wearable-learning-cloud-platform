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
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 250);
		var outputState3 = GameEditorTestingHelpers.addState(1000, 250);
		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
		var connection6 = GameEditorTestingHelpers.addConnection(outputState3.htmlId, outputState4.htmlId);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		outputState2.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		outputState3.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState3.onChange();

		expect(outputState.scopeMask == 8092 && outputState2.scopeMask == 8108 && outputState3.scopeMask == 8140 && outputState4.scopeMask == 114).toBeTruthy();
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
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 250);
		var outputState3 = GameEditorTestingHelpers.addState(1000, 250);
		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
		var connection6 = GameEditorTestingHelpers.addConnection(outputState3.htmlId, outputState4.htmlId);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		outputState3.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState3.onChange();

		expect(outputState.scopeMask == 2 && outputState2.scopeMask == 4 && outputState3.scopeMask == 8 && outputState4.scopeMask == 8191).toBeTruthy();
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
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(0, 250);
		var outputState2 = GameEditorTestingHelpers.addState(150, 250);
		var outputState3 = GameEditorTestingHelpers.addState(300, 250);
		var outputState4 = GameEditorTestingHelpers.addState(450, 250);
		var outputState5 = GameEditorTestingHelpers.addState(600, 250);
		var outputState6 = GameEditorTestingHelpers.addState(750, 250);
		var outputState7 = GameEditorTestingHelpers.addState(900, 250);
		var outputState8 = GameEditorTestingHelpers.addState(1050, 250);
		var outputState9 = GameEditorTestingHelpers.addState(1200, 250);
		var outputState10 = GameEditorTestingHelpers.addState(750, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState4.htmlId);
		var connection5 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState5.htmlId);
		var connection6 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState6.htmlId);
		var connection7 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState7.htmlId);
		var connection8 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState8.htmlId);
		var connection9 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState9.htmlId);

		var connection10 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState10.htmlId);
		var connection11 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState10.htmlId);
		var connection12 = GameEditorTestingHelpers.addConnection(outputState3.htmlId, outputState10.htmlId);
		var connection13 = GameEditorTestingHelpers.addConnection(outputState4.htmlId, outputState10.htmlId);
		var connection14 = GameEditorTestingHelpers.addConnection(outputState5.htmlId, outputState10.htmlId);
		var connection15 = GameEditorTestingHelpers.addConnection(outputState6.htmlId, outputState10.htmlId);
		var connection16 = GameEditorTestingHelpers.addConnection(outputState7.htmlId, outputState10.htmlId);
		var connection17 = GameEditorTestingHelpers.addConnection(outputState8.htmlId, outputState10.htmlId);
		var connection18 = GameEditorTestingHelpers.addConnection(outputState9.htmlId, outputState10.htmlId);
		
		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		outputState2.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		outputState3.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState3.onChange();
		outputState4.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
		outputState4.onChange();
		outputState5.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState5.onChange();
		outputState6.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState6.onChange();
		outputState7.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState7.onChange();
		outputState8.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState8.onChange();
		outputState9.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState9.onChange();

		expect(outputState.scopeMask == 16 && outputState2.scopeMask == 32 && outputState3.scopeMask == 64 && 
			   outputState4.scopeMask == 128 && outputState5.scopeMask == 256 && outputState6.scopeMask == 512 &&
			   outputState7.scopeMask == 1024 && outputState8.scopeMask == 2048 && outputState9.scopeMask == 4096 &&
			   outputState10.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transition Scope Change Game Wide -> Game Wide (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();

		expect(outputState.scopeMask).toEqual(8191);
	});
	it("Single Connection Single Transition Game Wide Active Scope Change Game Wide -> Game Wide (Another State) (3x3)", function() {
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
	it("Single Connection Single Transition Game Wide -> Team Wide (Another State) (3x3)", function() {
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
	it("Single Connection Single Transition Player Wide -> Team Wide Same State Single Team (3x3)", function() {
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
		transition.onChange();
		
		expect(outputState.scopeMask == 1 && transition.scopeMask == 8188 && outputState2.scopeMask == 114).toBeTruthy();
	});
	it("Single Connection Single Transition Player Wide -> Team Wide Different States Single Team (3x3)", function() {
//		GameEditorTestingHelpers.resetGameEditor();
//		
//		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
//		var outputState = GameEditorTestingHelpers.addState(500, 250);
//		var outputState2 = GameEditorTestingHelpers.addState(750, 250);
//		var outputState3 = GameEditorTestingHelpers.addState(1000, 250);
//		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
//		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
//		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
//		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
//		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
//		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
//		var connection6 = GameEditorTestingHelpers.addConnection(outputState3.htmlId, outputState4.htmlId);
//		
//		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
//		outputState.onChange();
//		outputState2.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
//		outputState2.onChange();
//		outputState3.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
//		outputState3.onChange();
//
//		expect(outputState.scopeMask == 8092 && outputState2.scopeMask == 8108 && outputState3.scopeMask == 8140 && outputState4.scopeMask == 114).toBeTruthy();
	});
	it("Single Connection Single Transition Team Wide -> Game Wide Same State (3x3)", function() {
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
	it("Single Connection Single Transition Team Wide -> Game Wide Different States (3x3)", function() {
//		GameEditorTestingHelpers.resetGameEditor();
//		
//		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
//		var outputState = GameEditorTestingHelpers.addState(500, 250);
//		var outputState2 = GameEditorTestingHelpers.addState(750, 250);
//		var outputState3 = GameEditorTestingHelpers.addState(1000, 250);
//		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
//		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
//		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
//		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
//		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
//		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
//		var connection6 = GameEditorTestingHelpers.addConnection(outputState3.htmlId, outputState4.htmlId);
//		
//		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
//		outputState.onChange();
//		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
//		outputState2.onChange();
//		outputState3.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
//		outputState3.onChange();
//
//		expect(outputState.scopeMask == 2 && outputState2.scopeMask == 4 && outputState3.scopeMask == 8 && outputState4.scopeMask == 8191).toBeTruthy();
	});
	it("Single Connection Single Transition Player Wide -> Game Wide Same State (3x3)", function() {
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
	it("Single Connection Single Transition Player Wide -> Game Wide Different States (3x3)", function() {
//		
//		GameEditorTestingHelpers.resetGameEditor();
//		
//		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
//		var outputState = GameEditorTestingHelpers.addState(0, 250);
//		var outputState2 = GameEditorTestingHelpers.addState(150, 250);
//		var outputState3 = GameEditorTestingHelpers.addState(300, 250);
//		var outputState4 = GameEditorTestingHelpers.addState(450, 250);
//		var outputState5 = GameEditorTestingHelpers.addState(600, 250);
//		var outputState6 = GameEditorTestingHelpers.addState(750, 250);
//		var outputState7 = GameEditorTestingHelpers.addState(900, 250);
//		var outputState8 = GameEditorTestingHelpers.addState(1050, 250);
//		var outputState9 = GameEditorTestingHelpers.addState(1200, 250);
//		var outputState10 = GameEditorTestingHelpers.addState(750, 500);
//		
//		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
//		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
//		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
//		var connection4 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState4.htmlId);
//		var connection5 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState5.htmlId);
//		var connection6 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState6.htmlId);
//		var connection7 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState7.htmlId);
//		var connection8 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState8.htmlId);
//		var connection9 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState9.htmlId);
//
//		var connection10 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState10.htmlId);
//		var connection11 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState10.htmlId);
//		var connection12 = GameEditorTestingHelpers.addConnection(outputState3.htmlId, outputState10.htmlId);
//		var connection13 = GameEditorTestingHelpers.addConnection(outputState4.htmlId, outputState10.htmlId);
//		var connection14 = GameEditorTestingHelpers.addConnection(outputState5.htmlId, outputState10.htmlId);
//		var connection15 = GameEditorTestingHelpers.addConnection(outputState6.htmlId, outputState10.htmlId);
//		var connection16 = GameEditorTestingHelpers.addConnection(outputState7.htmlId, outputState10.htmlId);
//		var connection17 = GameEditorTestingHelpers.addConnection(outputState8.htmlId, outputState10.htmlId);
//		var connection18 = GameEditorTestingHelpers.addConnection(outputState9.htmlId, outputState10.htmlId);
//		
//		outputState.modelJSON.iconTabs[4].navigationContainerPages[0].displayText = "Hello World!";
//		outputState.onChange();
//		outputState2.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
//		outputState2.onChange();
//		outputState3.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
//		outputState3.onChange();
//		outputState4.modelJSON.iconTabs[2].navigationContainerPages[0].displayText = "Hello World!";
//		outputState4.onChange();
//		outputState5.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
//		outputState5.onChange();
//		outputState6.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
//		outputState6.onChange();
//		outputState7.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
//		outputState7.onChange();
//		outputState8.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
//		outputState8.onChange();
//		outputState9.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
//		outputState9.onChange();
//
//		expect(outputState.scopeMask == 16 && outputState2.scopeMask == 32 && outputState3.scopeMask == 64 && 
//			   outputState4.scopeMask == 128 && outputState5.scopeMask == 256 && outputState6.scopeMask == 512 &&
//			   outputState7.scopeMask == 1024 && outputState8.scopeMask == 2048 && outputState9.scopeMask == 4096 &&
//			   outputState10.scopeMask == 8191).toBeTruthy();
	});
});