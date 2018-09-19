package wlcp.gameserver.api;

import java.nio.channels.CompletionHandler;

import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectRejectedPacket;
import wlcp.shared.packets.DisplayTextPacket;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GameTeamsPacket;
import wlcp.shared.packets.HeartBeatPacket;
import wlcp.shared.packets.KeyboardInputPacket;
import wlcp.shared.packets.SequenceButtonPressPacket;
import wlcp.shared.packets.SingleButtonPressPacket;

/**
 * This is a base listener that has been provided for convience and 
 * as well as something to start with. Mostly all listeners can be
 * implemented differently, but some such as heart beat can
 * be implemented generically.
 * @author Matthew Micciolo
 *
 */
public class WLCPBaseGameServerListener implements WLCPGameServerListener {
	
	protected String username;
	protected int gameInstanceId;
	protected int gameLobbyId;
	protected int team;
	protected int player;

	
	public void recievedHearbeat(IWLCPGameServer gameServer, HeartBeatPacket packet) {
		HeartBeatPacket heartBeatPacket = new HeartBeatPacket(gameInstanceId, team, player);
		gameServer.SendPacket(heartBeatPacket, new CompletionHandler<Void, Void>() {
			
			public void completed(Void result, Void attachment) {

			}

			
			public void failed(Throwable exc, Void attachment) {

			}
		}, null);
	}

	public void gameLobbiesRecieved(IWLCPGameServer gameServer, GameLobbiesPacket packet) {
		// TODO Auto-generated method stub
		
	}

	public void gameTeamsRecieved(IWLCPGameServer gameServer, GameTeamsPacket packet) {
		// TODO Auto-generated method stub
		
	}

	public void connectToGameAccepted(IWLCPGameServer gameServer, ConnectAcceptedPacket packet) {
		// TODO Auto-generated method stub
		
	}

	public void connectToGameRejected(IWLCPGameServer gameServer, ConnectRejectedPacket packet) {
		// TODO Auto-generated method stub
		
	}

	public void recievedDisplayText(IWLCPGameServer gameServer, DisplayTextPacket packet) {
		// TODO Auto-generated method stub
		
	}

	public void requestSingleButtonPress(IWLCPGameServer gameServer, SingleButtonPressPacket packet) {
		// TODO Auto-generated method stub
		
	}

	public void requestSequenceButtonPress(IWLCPGameServer gameServer, SequenceButtonPressPacket packet) {
		// TODO Auto-generated method stub
		
	}

	public void requestKeyboardInput(IWLCPGameServer gameServer, KeyboardInputPacket packet) {
		// TODO Auto-generated method stub
		
	}

}
