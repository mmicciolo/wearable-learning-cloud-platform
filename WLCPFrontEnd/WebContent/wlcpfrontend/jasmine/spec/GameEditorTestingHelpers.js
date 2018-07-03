var GameEditorTestingHelpers = {
		
	createNewGame : function() {
		
		var newGameModel = {
			GameId : "Test",
			TeamCount : 3,
			PlayersPerTeam : 3,
			StateIdCount : 0,
			TransitionIdCount : 0,
			ConnectionIdCount : 0,
			UsernameDetails : {
				__metadata : {
		            //uri : ODataModel.getODataModelURL() + "/Usernames('" + sap.ui.getCore().getModel("user").oData.username + "')"
					uri : ODataModel.getODataModelURL() + "/Usernames('mmicciolo')"
		         }
			},
			Visibility : true,
			DataLog : false
		};
		
		var gameModel = {
			GameId : "Test",
			TeamCount : 3,
			PlayersPerTeam : 3,
			StateIdCount : 0,
			TransitionIdCount : 0,
			ConnectionIdCount : 0,
			Visibility : true,
			DataLog : false
		};
		
		GameEditor.getEditorController().newGameModel = newGameModel
		GameEditor.getEditorController().gameModel = gameModel;
		
		GameEditor.getEditorController().initJsPlumb();  
		var startState = new StartState("startStateTopColor", "startStateBottomColor", "Start State" , gameModel.GameId + "_start", GameEditor.getJsPlumbInstance());
		startState.setPositionX(((document.getElementById("gameEditor--pad").offsetWidth / 2) - (150 / 2))); startState.setPositionY(100);
		startState.draw();
		GameEditor.getEditorController().stateList.push(startState);
		GameEditor.getEditorController().initToolbox();
		
		return startState.htmlId;

	},
	
	resetGameEditor : function() {
		GameEditor.getEditorController().resetEditor();
	},
	
	addState : function(x, y) {
		var outputState = new OutputState("toolboxOutputStateTopColor", "toolboxOutputStateBottomColor", "Output State" , GameEditor.getEditorController().createStateId(), GameEditor.getJsPlumbInstance());
		outputState.setPositionX(State.absoluteToRelativeX(x + 315, 150) + GameEditor.getScrollLeftOffset()); outputState.setPositionY(State.absoluteToRelativeY(y) + GameEditor.getScrollTopOffset());
		outputState.draw();
		GameEditor.getEditorController().stateList.push(outputState);
		return outputState.htmlId;
	},
	
	addConnection : function(sourceState, targetState) {
		var oEvent = {
			sourceId : sourceState,
			targetId : targetState,
			connection : {
				id : ""
			}
		}
		
		GameEditor.getEditorController().connectionDropped(oEvent);
		return GameEditor.getJsPlumbInstance().getConnections({source : oEvent.sourceId, target : oEvent.targetId})[0].id;
	}

}