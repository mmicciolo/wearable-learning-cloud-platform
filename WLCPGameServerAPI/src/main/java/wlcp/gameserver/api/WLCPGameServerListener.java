package wlcp.gameserver.api;

import wlcp.shared.packets.GameLobbiesPacket;

public interface WLCPGameServerListener {

	void GameLobbiesRecieved(GameLobbiesPacket packet);
}
