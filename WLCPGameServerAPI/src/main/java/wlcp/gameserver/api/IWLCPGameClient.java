package wlcp.gameserver.api;

public interface IWLCPGameClient {

	void connect(int gameInstanceId, int team, int player);
	void disconnect();
}
