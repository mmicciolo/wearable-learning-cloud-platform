package wlcp.gameserver.common;

import wlcp.gameserver.model.ClientData;
import wlcp.model.master.Username;

public class UsernameClientData {
	public UsernameClientData(Username username, ClientData clientData) {
		this.username = username;
		this.clientData = clientData;
	}
	public Username username;
	public ClientData clientData;
}

