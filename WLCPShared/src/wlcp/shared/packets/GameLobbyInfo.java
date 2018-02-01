package wlcp.shared.packets;


public class GameLobbyInfo {
	
	String gameName;
	String gameLobbyName;
	int gameLobbyId;
	int gameInstanceId;
	
	public GameLobbyInfo(String gameName, String gameLobbyName, int gameLobbyId, int gameInstanceId) {
		super();
		this.gameName = gameName;
		this.gameLobbyName = gameLobbyName;
		this.gameLobbyId = gameLobbyId;
		this.gameInstanceId = gameInstanceId;
	}
}
