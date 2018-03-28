package wlcp.shared.packets;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class DebugConnectPacket extends GamePacket implements IPacket {
	
	public DebugConnectPacket() {
		super(PacketTypes.DEBUG_CONNECT);
	}
	
	public DebugConnectPacket(int gameInstanceId, int team, int player) {
		super(PacketTypes.DEBUG_CONNECT);
		this.gameInstanceId = gameInstanceId;
		this.team = team;
		this.player = player;
	}
}
