package wlcp.gameserver.api;

import java.nio.channels.CompletionHandler;
import java.util.Scanner;

import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectPacket;
import wlcp.shared.packets.ConnectRejectedPacket;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GameLobbyInfo;
import wlcp.shared.packets.GameTeamsPacket;

public class WLCPGameServerAPITest {
	
	private static IWLCPGameServer wlcpGameServer = null;
	private String username = "mmicciolo";

	public static void main(String[] args) {
		
		//Create our server container
		wlcpGameServer = WLCPGameServerFactory.createServer("192.168.0.100", 3333);
		
		//Register our event listener callbacks
		wlcpGameServer.registerEventListener(new WLCPGameServerListenerimpl());
		
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
				//Packet sent successfully
			}

			@Override
			public void failed(Throwable exc, Void attachment) {
				//Error sending packet
				exc.getMessage();
			}	
		}, null);
	}
}

class WLCPGameServerListenerimpl extends WLCPBaseGameServerListener implements WLCPGameServerListener {
	
	private String username = "mmicciolo";
	private int gameInstanceId;
	private int gameLobbyId;
	
	@Override
	public void gameLobbiesRecieved(IWLCPGameServer gameServer, GameLobbiesPacket packet) {
		System.out.println("The following lobbies are available to join: ");
		for(GameLobbyInfo info : packet.getGameLobbyInfo()) {
			System.out.println(packet.getGameLobbyInfo().indexOf(info) + ". " + info.gameLobbyName);
		}
		Scanner sc = new Scanner(System.in);
		int i = sc.nextInt();
		System.out.println(i + " selected " + packet.getGameLobbyInfo().get(i).gameLobbyName + " getting avaliable teams.");
		gameInstanceId = packet.getGameLobbyInfo().get(i).gameInstanceId;
		gameLobbyId = packet.getGameLobbyInfo().get(i).gameLobbyId;
		GameTeamsPacket gameTeamsPacket = new GameTeamsPacket(packet.getGameLobbyInfo().get(i).gameInstanceId, packet.getGameLobbyInfo().get(i).gameLobbyId, "mmicciolo");
		gameServer.SendPacket(gameTeamsPacket, new CompletionHandler<Void, Void>() {
			@Override
			public void completed(Void result, Void attachment) {
				//Packet sent successfully
			}

			@Override
			public void failed(Throwable exc, Void attachment) {
				//Error sending packet
				exc.getMessage();
			}	
		}, null);
	}
	
	@Override
	public void gameTeamsRecieved(IWLCPGameServer gameServer, GameTeamsPacket packet) {
		System.out.println("The following teams are avaliable to join: ");
		for(Byte b : packet.getTeamNumbers()) {
			int teamNumber = (int) b;
			System.out.println(packet.getTeamNumbers().indexOf(b) + ". " + "Team " + teamNumber);
		}
		Scanner sc = new Scanner(System.in);
		int i = sc.nextInt();
		System.out.println(i + " selected team " + packet.getTeamNumbers().get(i) + " joining game.");
		ConnectPacket connectPacket = new ConnectPacket(gameInstanceId, username, gameLobbyId, packet.getTeamNumbers().get(i));
		gameServer.SendPacket(connectPacket, new CompletionHandler<Void, Void>() {
			@Override
			public void completed(Void result, Void attachment) {
				// TODO Auto-generated method stub
				
			}
			@Override
			public void failed(Throwable exc, Void attachment) {
				// TODO Auto-generated method stub
			}
		}, null);
	}
	
	@Override
	public void connectToGameAccepted(IWLCPGameServer gameServer, ConnectAcceptedPacket packet) {
		// TODO Auto-generated method stub
		System.out.println("ACCEPTED!");
	}

	@Override
	public void connectToGameRejected(IWLCPGameServer gameServer, ConnectRejectedPacket packet) {
		// TODO Auto-generated method stub
		
	}
}
