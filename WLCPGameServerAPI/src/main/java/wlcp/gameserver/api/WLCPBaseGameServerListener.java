package wlcp.gameserver.api;

import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectRejectedPacket;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GameTeamsPacket;

public class WLCPBaseGameServerListener implements WLCPGameServerListener {

	@Override
	public void recievedHearbeat(IWLCPGameServer gameServer) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void gameLobbiesRecieved(IWLCPGameServer gameServer, GameLobbiesPacket packet) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void gameTeamsRecieved(IWLCPGameServer gameServer, GameTeamsPacket packet) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectToGameAccepted(IWLCPGameServer gameServer, ConnectAcceptedPacket packet) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectToGameRejected(IWLCPGameServer gameServer, ConnectRejectedPacket packet) {
		// TODO Auto-generated method stub
		
	}

}
