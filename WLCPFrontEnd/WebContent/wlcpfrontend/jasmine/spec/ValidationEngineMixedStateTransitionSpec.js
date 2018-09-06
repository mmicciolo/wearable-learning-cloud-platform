describe("A suite to test cases where non-transition and transitions states are neighbors or come together", function() {
	it("Multiple Connection Some Transition Game Wide State (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 250);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		expect(outputState.scopeMask == 1 && outputState2.scopeMask == 0 && transition.scopeMask == 0).toBeTruthy();
	});
	it("Multiple Connection Some Transition Game Wide Transition (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(750, 250);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection2);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		expect(outputState.scopeMask == 0 && outputState2.scopeMask == 8191  && transition.scopeMask == 1).toBeTruthy();
	});
	it("Multiple Connection Some Transition Neighbors With Different Parents Neighbor All Transitions State", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(1000, 250);
		var outputState3 = GameEditorTestingHelpers.addState(250, 500);
		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
		var outputState5 = GameEditorTestingHelpers.addState(1250, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState3.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
		var connection6 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState5.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection3);
		var transition2 = GameEditorTestingHelpers.addTransition(connection4);
		var transition3 = GameEditorTestingHelpers.addTransition(connection6);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		outputState4.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState4.onChange();
		
		expect(outputState.scopeMask == 10 && outputState2.scopeMask == 4 && transition.scopeMask == 7178 && transition2.scopeMask == 7178 && transition3.scopeMask == 0 &&
			   outputState3.scopeMask == 114 && outputState4.scopeMask == 118 && outputState5.scopeMask == 0).toBeTruthy();
	});
	it("Multiple Connection Some Transition Neighbors With Different Parents Neighbor All Transitions Transition", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(1000, 250);
		var outputState3 = GameEditorTestingHelpers.addState(250, 500);
		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
		var outputState5 = GameEditorTestingHelpers.addState(1250, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState3.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
		var connection6 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState5.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection3);
		var transition2 = GameEditorTestingHelpers.addTransition(connection4);
		var transition3 = GameEditorTestingHelpers.addTransition(connection6);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.modelJSON.iconTabs[3].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		transition3.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition3.onChange();
		
		expect(outputState.scopeMask == 10 && outputState2.scopeMask == 4 && transition.scopeMask == 7178 && transition2.scopeMask == 7178 && transition3.scopeMask == 4 &&
			   outputState3.scopeMask == 114 && outputState4.scopeMask == 114 && outputState5.scopeMask == 900).toBeTruthy();
	});
	it("Multiple Connection Some Transition Neighbors With Different Parents Neighbor Not All Transitions State", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(1000, 250);
		var outputState3 = GameEditorTestingHelpers.addState(250, 500);
		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
		var outputState5 = GameEditorTestingHelpers.addState(1250, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState3.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
		var connection6 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState5.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection3);
		var transition2 = GameEditorTestingHelpers.addTransition(connection6);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition2.onChange();
		
		expect(outputState.scopeMask == 7178 && outputState2.scopeMask == 7180 && transition.scopeMask == 2 && transition2.scopeMask == 4 &&
			   outputState3.scopeMask == 114 && outputState4.scopeMask == 0 && outputState5.scopeMask == 900).toBeTruthy();
	});
	it("Multiple Connection Some Transition Neighbors With Different Parents Neighbor Not All Transitions Transition", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 250);
		var outputState2 = GameEditorTestingHelpers.addState(1000, 250);
		var outputState3 = GameEditorTestingHelpers.addState(250, 500);
		var outputState4 = GameEditorTestingHelpers.addState(750, 500);
		var outputState5 = GameEditorTestingHelpers.addState(1250, 500);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState3.htmlId);
		var connection4 = GameEditorTestingHelpers.addConnection(outputState.htmlId, outputState4.htmlId);
		var connection5 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState4.htmlId);
		var connection6 = GameEditorTestingHelpers.addConnection(outputState2.htmlId, outputState5.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection3);
		var transition2 = GameEditorTestingHelpers.addTransition(connection6);
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		outputState4.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState4.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(outputState.scopeMask == 7178 && outputState2.scopeMask == 7180 && transition.scopeMask == 0 && transition2.scopeMask == 0 &&
			   outputState3.scopeMask == 0 && outputState4.scopeMask == 6 && outputState5.scopeMask == 0).toBeTruthy();
	});	
	it("Multiple Connection All Transition No NeighborMask For Transition Game Wide", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 400);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		var outputState3 = GameEditorTestingHelpers.addState(1050, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		var transition3 = GameEditorTestingHelpers.addTransition(connection3);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		transition3.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[2].selected = true;
		transition3.onChange();
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(transition.scopeMask == 1 && transition2.scopeMask == 1 && transition3.scopeMask == 1 &&
			   outputState.scopeMask == 8078 && outputState2.scopeMask == 8078 && outputState3.scopeMask == 8191).toBeTruthy();	
	});
	it("Multiple Connection All Transition No NeighborMask For Transition Team Wide", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 400);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		var outputState3 = GameEditorTestingHelpers.addState(1050, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		var transition3 = GameEditorTestingHelpers.addTransition(connection3);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		transition3.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[2].selected = true;
		transition3.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		outputState3.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState3.onChange();
		
		expect(transition.scopeMask == 8078 && transition2.scopeMask == 8078 && transition3.scopeMask == 8078 &&
			   outputState.scopeMask == 2 && outputState2.scopeMask == 2 && outputState3.scopeMask == 2).toBeTruthy();
	});
	it("Multiple Connection Some Transition No NeighborMask For Transition Game Wide", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 400);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		var outputState3 = GameEditorTestingHelpers.addState(1050, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		outputState.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[1].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(transition.scopeMask == 1 && transition2.scopeMask == 1 &&
			   outputState.scopeMask == 8078 && outputState2.scopeMask == 8078 && outputState3.scopeMask == 0).toBeTruthy();
	});
	it("Multiple Connection Some Transition No NeighborMask For Transition Team Wide", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 400);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		var outputState3 = GameEditorTestingHelpers.addState(1050, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		expect(transition.scopeMask == 8078 && transition2.scopeMask == 8078 &&
			   outputState.scopeMask == 2 && outputState2.scopeMask == 2 && outputState3.scopeMask == 8076).toBeTruthy();
	});
	it("Multiple Connection Equal Transition No NeighborMask For Transition Team Wide", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(500, 400);
		var outputState2 = GameEditorTestingHelpers.addState(750, 400);
		var outputState3 = GameEditorTestingHelpers.addState(1050, 400);
		var outputState4 = GameEditorTestingHelpers.addState(1250, 400);
		
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var connection2 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState2.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState3.htmlId);
		var connection3 = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState4.htmlId);
		
		var transition = GameEditorTestingHelpers.addTransition(connection);
		var transition2 = GameEditorTestingHelpers.addTransition(connection2);
		
		transition.modelJSON.iconTabs[1].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		transition2.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[1].selected = true;
		transition2.onChange();
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState.onChange();
		
		outputState2.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState2.onChange();
		
		outputState3.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState3.onChange();
		
		outputState4.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		outputState4.onChange();
		
		expect(transition.scopeMask == 2 && transition2.scopeMask == 2 &&
			   outputState.scopeMask == 2 && outputState2.scopeMask == 2 && outputState3.scopeMask == 4 && outputState4.scopeMask == 8).toBeTruthy();
	});
	
});