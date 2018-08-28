package wlcp.gameserver.api;

public class WLCPGameServerFactory {
	
	public static IWLCPGameServer createServer(String ipAddress, int ipPort) {
		WLCPGameServer server = new WLCPGameServer("192.168.0.100", 3333);
		return server;
	}
}
