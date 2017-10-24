sap.ui.controller("wlcpfrontend.controllers.CreateLoadGame", {
	
	/**
	 * This function is called when the Create Game Button is pressed
	 * on the Create Load Game Dialog that shows when the editor is
	 * first loaded.
	 */
	createGamePressed : function() {
		sap.ui.getCore().byId("createLoadGame").close();
		sap.ui.getCore().byId("createLoadGame").destroy();
		sap.ui.xmlfragment("wlcpfrontend.fragments.GameEditor.CreateGame", sap.ui.controller("wlcpfrontend.controllers.CreateLoadGame")).open();
	},
	
	/**
	 * This function is called when the Load Game Button is pressed
	 * on the Create Load Game Dialog that shows when the editor is
	 * first loaded.
	 */
	loadGame : function() {
		
	},
	
	cancelCreateLoadGame : function() {
		sap.ui.getCore().byId("createLoadGame").close();
		sap.ui.getCore().byId("createLoadGame").destroy();
	},
	
	/**
	 * This is called when the create button is pressed on the Create Game
	 * Dialog. If it succeeds, createGameSuccess will be called.
	 */
	createGame : function() {
		sap.ui.getCore().getModel("odata").create("/Games", sap.ui.getCore().byId("gameEditor").getController().newGameModel, {success : this.createGameSuccess, error: this.createGameError});
	},
	
	/**
	 * Called when the user wants to cancel creating a game.
	 * They will be returned to main editor screen with all controls disabled
	 * except for the main toolbar.
	 */
	cancelCreateGame : function() {
		sap.ui.getCore().byId("createGame").close();
		sap.ui.getCore().byId("createGame").destroy();
	},
	
	/**
	 * Called if the game has been created in the back end successfully.
	 * The game editors or game managers model will be updated accordingly.
	 * The dialog will be closed and a success message shown.
	 */
	createGameSuccess : function(oSuccess) {
		if(sap.ui.getCore().byId("gameEditor") != null) {
			sap.ui.getCore().byId("gameEditor").getController().gameModel.GameId = sap.ui.getCore().byId("gameEditor").getController().newGameModel.GameId;
			sap.ui.getCore().byId("gameEditor").getController().gameModel.TeamCount = sap.ui.getCore().byId("gameEditor").getController().newGameModel.TeamCount;
			sap.ui.getCore().byId("gameEditor").getController().gameModel.PlayersPerTeam = sap.ui.getCore().byId("gameEditor").getController().newGameModel.PlayersPerTeam;
			sap.ui.getCore().byId("gameEditor").getController().gameModel.Visibility = sap.ui.getCore().byId("gameEditor").getController().newGameModel.Visibility;
			sap.ui.getCore().byId("gameEditor").getController().newGameModel.GameId = "";
			sap.ui.getCore().byId("gameEditor").getController().newGameModel.TeamCount = 0;
			sap.ui.getCore().byId("gameEditor").getController().newGameModel.PlayersPerTeam = 0;
			sap.ui.getCore().byId("gameEditor").getController().newGameModel.Visibility = true;
			sap.ui.getCore().byId("gameEditor").getController().initNewGame();
		}
		sap.ui.getCore().byId("createGame").close();
		sap.ui.getCore().byId("createGame").destroy();
		sap.m.MessageToast.show("Game Created Successfully!");
	},
	
	/**
	 * If an error occurs creating the game in the back end
	 * and error message will be shown.
	 */
	createGameError : function(oError) {
		sap.m.MessageBox.error("There was an error creating a game.");
	}
});