package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class GameInstanceStoppedPacket extends ServerPacket implements IPacket {

	public GameInstanceStoppedPacket() {
		super(PacketTypes.GAME_INSTANCE_STOPPED);
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		return super.assembleOutputBytes();
	}

}
