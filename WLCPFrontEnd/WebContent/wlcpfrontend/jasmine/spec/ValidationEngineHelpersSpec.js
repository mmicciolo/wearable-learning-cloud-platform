describe("A suite to test the Validation Engine helpers", function() {
	it("Test getActiveScopes no active scopes", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		var activeScopes = outputState.getActiveScopes();
		
		expect(activeScopes).toEqual([]);
	});
	it("Test getActiveScopes active scopes (Display Text)", function() {
		
		GameEditorTestingHelpers.resetGameEditor();
		
		var startState = GameEditorTestingHelpers.createNewGame();
		var outputState = GameEditorTestingHelpers.addState(500, 500);
		var connection = GameEditorTestingHelpers.addConnection(startState.htmlId, outputState.htmlId);
		
		outputState.modelJSON.iconTabs[0].navigationContainerPages[0].displayText = "Hello World!";
		
		var activeScopes = outputState.getActiveScopes();
		
		expect(activeScopes).toEqual(["Game Wide"]);
	});
	it("Test getActiveScopeMask Game Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Game Wide"]);
		expect(activeScopeMask).toEqual(1);
	});
	it("Test getActiveScopeMask Team Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Team 1"]);
		expect(activeScopeMask).toEqual(2);
	});
	it("Test getActiveScopeMask Player Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Team 1 Player 1"]);
		expect(activeScopeMask).toEqual(16);
	});
	it("Test getActiveScopeMask Team Wide Player Wide (3x3)", function() {
		var activeScopeMask = ValidationEngineHelpers.getActiveScopeMask(3, 3, ["Team 1", "Team 2 Player 1"]);
		expect(activeScopeMask).toEqual(130);
	});
	it("Test getActiveScopeMasks Game Wide (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 2);
		expect(activeScopeMasks).toEqual([8078]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 16);
		expect(activeScopeMasks).toEqual([8188]);
	});
	it("Test getActiveScopeMasks Team 1 Team 2 Player 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 130);
		expect(activeScopeMasks).toEqual([8078, 8186]);
	});
	it("Test getActiveScopeMasks Game Wide (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 2);
		expect(activeScopeMasks).toEqual([454]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 16);
		expect(activeScopeMasks).toEqual([508]);
	});
	it("Test getActiveScopeMasks Team 1 Team 2 Player 1 (2x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(2, 3, 130);
		expect(activeScopeMasks).toEqual([454, 506]);
	});
	it("Test getActiveScopeMasks Game Wide (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 2);
		expect(activeScopeMasks).toEqual([974]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 16);
		expect(activeScopeMasks).toEqual([1020]);
	});
	it("Test getActiveScopeMasks Team 1 Team 2 Player 1 (3x2)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 2, 130);
		expect(activeScopeMasks).toEqual([974, 1018]);
	});
	it("Test getActiveScopeMasks Game Wide (1x1)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(1, 1, 1);
		expect(activeScopeMasks).toEqual([1]);
	});
	it("Test getActiveScopeMasks Team 1 (1x1)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(1, 1, 2);
		expect(activeScopeMasks).toEqual([2]);
	});
	it("Test getActiveScopeMasks Team 1 Player 1 (1x1)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(1, 1, 4);
		expect(activeScopeMasks).toEqual([4]);
	});
	it("Test andActiveScopeMasks Team 1 Team 2 Player 1 (3x3)", function() {
		var activeScopeMasks = ValidationEngineHelpers.getActiveScopeMasks(3, 3, 130);
		var andActiveScopeMask = ValidationEngineHelpers.andActiveScopeMasks(activeScopeMasks);
		expect(andActiveScopeMask).toEqual(8074);
	});
});