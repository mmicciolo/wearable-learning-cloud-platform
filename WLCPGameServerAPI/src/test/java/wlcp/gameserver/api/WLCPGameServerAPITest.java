package wlcp.gameserver.api;

import java.nio.channels.CompletionHandler;
import java.util.Scanner;

import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectRejectedPacket;
import wlcp.shared.packets.DisplayTextPacket;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GameLobbyInfo;
import wlcp.shared.packets.GameTeamsPacket;
import wlcp.shared.packets.KeyboardInputPacket;
import wlcp.shared.packets.SequenceButtonPressPacket;
import wlcp.shared.packets.SingleButtonPressPacket;

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
            	
            	//The TCP Connection was successful
            	//Get the avaliable game lobbies for the user
            	wlcpGameServer.getGameLobbiesForUsername("mmicciolo");
            }

            @Override
            public void failed(Throwable exc, WLCPGameServer channel) {
            	
            	//The connection failed. Better handling should be implemented other than
            	//print the stack trace such as a pop up message.
            	exc.printStackTrace();
            }}, null);
		
		//Loop forever
		while(true) {
			
		}
	}
}

class WLCPGameServerListenerimpl extends WLCPBaseGameServerListener implements WLCPGameServerListener {
	
	@Override
	public void gameLobbiesRecieved(IWLCPGameServer gameServer, GameLobbiesPacket packet) {
		System.out.println("The following lobbies are available to join: ");
		for(GameLobbyInfo info : packet.getGameLobbyInfo()) {
			System.out.println(packet.getGameLobbyInfo().indexOf(info) + ". " + info.gameLobbyName);
		}
		Scanner sc = new Scanner(System.in);
		int i = sc.nextInt();
		//sc.close();
		System.out.println(i + " selected " + packet.getGameLobbyInfo().get(i).gameLobbyName + " getting avaliable teams.");
		gameInstanceId = packet.getGameLobbyInfo().get(i).gameInstanceId;
		gameLobbyId = packet.getGameLobbyInfo().get(i).gameLobbyId;
		gameServer.getTeamsForGameLobby(gameInstanceId, gameLobbyId, username);
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
		//sc.close();
		System.out.println(i + " selected team " + packet.getTeamNumbers().get(i) + " joining game.");
		gameServer.joinGameLobby(gameInstanceId, gameLobbyId, packet.getTeamNumbers().get(i), username);
	}
	
	@Override
	public void connectToGameAccepted(IWLCPGameServer gameServer, ConnectAcceptedPacket packet) {
		team = packet.getTeam();
		player = packet.getPlayer();
		System.out.println("ACCEPTED!");
	}

	@Override
	public void connectToGameRejected(IWLCPGameServer gameServer, ConnectRejectedPacket packet) {
		//Could not connect to game!
	}
	
	@Override
	public void recievedDisplayText(IWLCPGameServer gameServer, DisplayTextPacket packet) {
		System.out.println(packet.getDisplayText());
	}
	
	@Override
	public void requestSingleButtonPress(IWLCPGameServer gameServer, SingleButtonPressPacket packet) {
		System.out.print("Please enter a button 1-4: ");
		Scanner sc = new Scanner(System.in);
		int i = sc.nextInt();
		System.out.println("");
		gameServer.sendSingleButtonPress(gameInstanceId, team, player, i);
	}

	@Override
	public void requestSequenceButtonPress(IWLCPGameServer gameServer, SequenceButtonPressPacket packet) {
		System.out.print("Please enter a button sequence (eg 1234): ");
		Scanner sc = new Scanner(System.in);
		String i = sc.nextLine();
		System.out.println("");
		gameServer.sendSequenceButtonPress(gameInstanceId, team, player, i);
	}

	@Override
	public void requestKeyboardInput(IWLCPGameServer gameServer, KeyboardInputPacket packet) {
		System.out.print("Please input using the keyboard: ");
		Scanner sc = new Scanner(System.in);
		String i = sc.nextLine();
		System.out.println("");
		gameServer.sendKeyboardInput(gameInstanceId, team, player, i);
	}
}
