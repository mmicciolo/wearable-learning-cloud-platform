package wlcp.gameserver.api;

public class WLCPGameServerFactory {
	
	public static IWLCPGameServer createServer(String ipAddress, int ipPort) {
		WLCPGameServer server = new WLCPGameServer(ipAddress, ipPort);
		return server;
	}
}
