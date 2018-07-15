describe("A suite to test the Validation Engine Transition Functionality", function() {
	it("Single Connection Single Transition Game Wide Active (Start) (3x3)", function() {
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame(3, 3);
		var outputState = GameEditorTestingHelpers.addState(750, 350);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		var transition = GameEditorTestingHelpers.addTransition(connection);
		
		transition.modelJSON.iconTabs[0].navigationContainerPages[0].singlePress[0].selected = true;
		transition.onChange();
		
		expect(transition.scopeMask).toEqual(1);
	});
});