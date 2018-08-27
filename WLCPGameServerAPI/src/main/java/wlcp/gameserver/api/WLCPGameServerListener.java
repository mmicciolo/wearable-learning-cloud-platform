package wlcp.gameserver.api;

import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectRejectedPacket;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GameTeamsPacket;

public interface WLCPGameServerListener {

	void recievedHearbeat(IWLCPGameServer gameServer);
	void gameLobbiesRecieved(IWLCPGameServer gameServer, GameLobbiesPacket packet);
	void gameTeamsRecieved(IWLCPGameServer gameServer, GameTeamsPacket packet);
	void connectToGameAccepted(IWLCPGameServer gameServer, ConnectAcceptedPacket packet);
	void connectToGameRejected(IWLCPGameServer gameServer, ConnectRejectedPacket packet);
}
