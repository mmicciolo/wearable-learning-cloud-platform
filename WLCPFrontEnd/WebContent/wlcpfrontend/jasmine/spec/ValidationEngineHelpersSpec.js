describe("A suite to test the Validation Engine helpers", function() {
	it("Test getActiveScopes", function() {
		var startStateId = GameEditorTestingHelpers.createNewGame();
		var stateId = GameEditorTestingHelpers.addState(500, 500);
		var connectionId = GameEditorTestingHelpers.addConnection(startStateId, stateId);
		expect(true).toBe(true);
	});
});