package wlcp.gameserver.api;

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
 * Listeners that must be implemented in order for basic functionality
 * of the game client.
 * @author Matthew Micciolo
 *
 */
public interface WLCPGameServerListener {
	void recievedHearbeat(IWLCPGameServer gameServer, HeartBeatPacket packet);
	void gameLobbiesRecieved(IWLCPGameServer gameServer, GameLobbiesPacket packet);
	void gameTeamsRecieved(IWLCPGameServer gameServer, GameTeamsPacket packet);
	void connectToGameAccepted(IWLCPGameServer gameServer, ConnectAcceptedPacket packet);
	void connectToGameRejected(IWLCPGameServer gameServer, ConnectRejectedPacket packet);
	void recievedDisplayText(IWLCPGameServer gameServer, DisplayTextPacket packet);
	void requestSingleButtonPress(IWLCPGameServer gameServer, SingleButtonPressPacket packet);
	void requestSequenceButtonPress(IWLCPGameServer gameServer, SequenceButtonPressPacket packet);
	void requestKeyboardInput(IWLCPGameServer gameServer, KeyboardInputPacket packet);
}
