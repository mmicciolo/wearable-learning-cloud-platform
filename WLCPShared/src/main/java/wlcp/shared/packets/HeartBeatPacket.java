package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class HeartBeatPacket extends GamePacket implements IPacket {

	public HeartBeatPacket() {
		super(PacketTypes.HEARTBEAT);
	}
	
	public HeartBeatPacket(int gameInstanceId, int team, int player) {
		super(PacketTypes.HEARTBEAT);
		this.gameInstanceId = gameInstanceId;
		this.team = team;
		this.player = player;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

}
