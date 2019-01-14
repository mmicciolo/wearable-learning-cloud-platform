package wlcp.gameserver.model;

import wlcp.gameserver.spring.service.PlayerVMService;

public class Player {
	public UsernameClientData usernameClientData;
	public TeamPlayer teamPlayer;
	public PlayerVMService playerVM;
	
	public Player(UsernameClientData usernameClientData, TeamPlayer teamPlayer) {
		this.usernameClientData = usernameClientData;
		this.teamPlayer = teamPlayer;
	}
}




