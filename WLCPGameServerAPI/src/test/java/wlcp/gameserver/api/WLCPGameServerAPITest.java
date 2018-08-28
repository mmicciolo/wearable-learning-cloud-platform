package wlcp.gameserver.api;

import java.nio.channels.CompletionHandler;
import java.util.Scanner;

import wlcp.shared.packet.PacketTypes;
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
	static final String username = "mmicciolo";
	static TransitionType currentTransition = TransitionType.NONE;
	private static Scanner scanner = new Scanner(System.in);
	private static WLCPGameServerListenerimpl wlcpGameServerListenerImpl = new WLCPGameServerListenerimpl();

	public static void main(String[] args) throws InterruptedException {
		
		//Create our server container
		wlcpGameServer = WLCPGameServerFactory.createServer("192.168.0.100", 3333);
		
		//Register our event listener callbacks
		wlcpGameServer.registerEventListener(wlcpGameServerListenerImpl);
		
		//Make the TCP connection
		wlcpGameServer.connect(new CompletionHandler<Void, WLCPGameServer>() {
            @Override
            public void completed(Void result, WLCPGameServer channel ) {  
            	
            	//The TCP Connection was successful
            	//Get the avaliable game lobbies for the user
            	wlcpGameServer.getGameLobbiesForUsername(username);
            }

            @Override
            public void failed(Throwable exc, WLCPGameServer channel) {
            	
            	//The connection failed. Better handling should be implemented other than
            	//print the stack trace such as a pop up message.
            	exc.printStackTrace();
            }}, null);
		
		//Loop forever and target 16ms frame time
		while(true) {
			long startTime = System.currentTimeMillis();
			handleInput();
			long endTime = System.currentTimeMillis();
			long finalTime = endTime - startTime;
			if(16 - finalTime > 0) {
				Thread.sleep(16 - finalTime);
			}
		}
	}
	
	//Handle non blocking input
	private static void handleInput() {
		switch(currentTransition) {
		case NONE:
			break;
		case SINGLE:
			int buttonPress = scanner.nextInt();
			System.out.println("");
			wlcpGameServer.sendSingleButtonPress(wlcpGameServerListenerImpl.gameInstanceId, wlcpGameServerListenerImpl.team, wlcpGameServerListenerImpl.player, buttonPress);
			currentTransition = TransitionType.NONE;
			break;
		case SEQUENCE:
			String sequenceButtonPress = scanner.next();
			System.out.println("");
			wlcpGameServer.sendSequenceButtonPress(wlcpGameServerListenerImpl.gameInstanceId, wlcpGameServerListenerImpl.team, wlcpGameServerListenerImpl.player, sequenceButtonPress);
			currentTransition = TransitionType.NONE;
			break;
		case KEYBOARD:
			String keyboardInput = scanner.next();
			System.out.println("");
			wlcpGameServer.sendKeyboardInput(wlcpGameServerListenerImpl.gameInstanceId, wlcpGameServerListenerImpl.team, wlcpGameServerListenerImpl.player, keyboardInput);
			currentTransition = TransitionType.NONE;
			break;
		}
	}
}

enum TransitionType {
	NONE,
	SINGLE,
	SEQUENCE,
	KEYBOARD
}

class WLCPGameServerListenerimpl extends WLCPBaseGameServerListener implements WLCPGameServerListener {
	
	private Scanner scanner = new Scanner(System.in);
	
	public WLCPGameServerListenerimpl() {
		username = WLCPGameServerAPITest.username;
	}
	
	@Override
	public void gameLobbiesRecieved(IWLCPGameServer gameServer, GameLobbiesPacket packet) {
		System.out.println("The following lobbies are available to join: ");
		for(GameLobbyInfo info : packet.getGameLobbyInfo()) {
			System.out.println(packet.getGameLobbyInfo().indexOf(info) + ". " + info.gameLobbyName);
		}
		int gameLobby = scanner.nextInt();
		System.out.println(gameLobby + " selected " + packet.getGameLobbyInfo().get(gameLobby).gameLobbyName + " getting avaliable teams.");
		gameInstanceId = packet.getGameLobbyInfo().get(gameLobby).gameInstanceId;
		gameLobbyId = packet.getGameLobbyInfo().get(gameLobby).gameLobbyId;
		gameServer.getTeamsForGameLobby(gameInstanceId, gameLobbyId, username);
	}
	
	@Override
	public void gameTeamsRecieved(IWLCPGameServer gameServer, GameTeamsPacket packet) {
		System.out.println("The following teams are avaliable to join: ");
		for(Byte b : packet.getTeamNumbers()) {
			int teamNumber = (int) b;
			System.out.println(packet.getTeamNumbers().indexOf(b) + ". " + "Team " + teamNumber);
		}
		int team = scanner.nextInt();
		System.out.println(team + " selected team " + packet.getTeamNumbers().get(team) + " joining game.");
		gameServer.joinGameLobby(gameInstanceId, gameLobbyId, packet.getTeamNumbers().get(team), username);
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
		System.out.println("Could not connect to game!");
	}
	
	@Override
	public void recievedDisplayText(IWLCPGameServer gameServer, DisplayTextPacket packet) {
		System.out.println(packet.getDisplayText());
	}
	
	@Override
	public void requestSingleButtonPress(IWLCPGameServer gameServer, SingleButtonPressPacket packet) {
		System.out.print("Please enter a button 1-4: ");
		WLCPGameServerAPITest.currentTransition = TransitionType.SINGLE;
	}

	@Override
	public void requestSequenceButtonPress(IWLCPGameServer gameServer, SequenceButtonPressPacket packet) {
		System.out.print("Please enter a button sequence (eg 1234): ");
		WLCPGameServerAPITest.currentTransition = TransitionType.SEQUENCE;
	}

	@Override
	public void requestKeyboardInput(IWLCPGameServer gameServer, KeyboardInputPacket packet) {
		System.out.print("Please input using the keyboard: ");
		WLCPGameServerAPITest.currentTransition = TransitionType.KEYBOARD;
	}
}
