/**
 * 
 */

class Connection {
	constructor(connectionFrom, connectionTo, gameConnectionId) {
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
		this.gameConnectionId = gameConnectionId;
	}
	
	save() {
		var saveData = {
			gameConnectionId : this.gameConnectionId,
			connectionFrom : this.connectionFrom,
			connectionTo : this.connectionTo,
			gameDetails : GameEditor.getEditorController().gameModel.GameId
		}
		return saveData;
	}
}