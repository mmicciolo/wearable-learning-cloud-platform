var DataLogger = {
		
	loggingEnabled : false,
		
	logGameEditor : function() {
		
		if(this.loggingEnabled) {
			
			var gameEditor = GameEditor.getEditorController();
			
			//Container for all of the data to be sent
			var saveJSON = {
					game : {
						gameId : gameEditor.gameModel.GameId,
						teamCount : gameEditor.gameModel.TeamCount,
						playersPerTeam : gameEditor.gameModel.PlayersPerTeam,
						stateIdCount : gameEditor.gameModel.StateIdCount,
						visibility : gameEditor.gameModel.Visibility,
					},
					states : [],
					connections : [],
					transitions :[]
			}
			
			//Loop through and save all of the states
			for(var i = 0; i < gameEditor.stateList.length; i++) {
				saveJSON.states.push(gameEditor.stateList[i].save());
			}
			
			//Loop through and save all of the connections
			for(var i = 0; i < gameEditor.connectionList.length; i++) {
				saveJSON.connections.push(gameEditor.connectionList[i].save());
			}
			
			//Loop through all of the transition
			for(var i = 0; i < gameEditor.transitionList.length; i++) {
				saveJSON.transitions.push(gameEditor.transitionList[i].save());
			}
			
			$.ajax({url: ODataModel.getWebAppURL() + "/LogGameEditor", type: 'POST', dataType: 'text', data: 'saveData=' + JSON.stringify(saveJSON), success : $.proxy(this.logSuccess, this), error : $.proxy(this.logError, this)});
		}
	},

	logSuccess : function() {
		
	},
	
	logError : function() {
		
	}

}