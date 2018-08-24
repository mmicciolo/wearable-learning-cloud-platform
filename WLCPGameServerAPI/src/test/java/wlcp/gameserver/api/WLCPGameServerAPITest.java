package wlcp.gameserver.api;

import java.nio.channels.CompletionHandler;

import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GameLobbyInfo;

public class WLCPGameServerAPITest {
	
	private static IWLCPGameServer wlcpGameServer = null;

	public static void main(String[] args) {
		
		//Create our server container
		wlcpGameServer = WLCPGameServerFactory.createServer("192.168.0.100", 3333);
		
		//Make the TCP connection
		wlcpGameServer.connect(new CompletionHandler<Void, WLCPGameServer>() {
            @Override
            public void completed(Void result, WLCPGameServer channel ) {  
            	ConnectedToServer();
            }

            @Override
            public void failed(Throwable exc, WLCPGameServer channel) {
            	exc.printStackTrace();
            }}, null);
		
		while(true) {
			
		}
	}
	
	private static void ConnectedToServer() {
		GameLobbiesPacket packet = new GameLobbiesPacket("mmicciolo");
		wlcpGameServer.SendPacket(packet, new CompletionHandler<Void, Void>() {
			@Override
			public void completed(Void result, Void attachment) {
				wlcpGameServer.registerEventListener(new WLCPGameServerListener() {

					@Override
					public void GameLobbiesRecieved(GameLobbiesPacket packet) {
						for(GameLobbyInfo info : packet.getGameLobbyInfo()) {
							System.out.println(info.gameLobbyName);
						}
					}
					
				});
			}

			@Override
			public void failed(Throwable exc, Void attachment) {
				// TODO Auto-generated method stub
				exc.getMessage();
			}	
		}, null);
	}
}
