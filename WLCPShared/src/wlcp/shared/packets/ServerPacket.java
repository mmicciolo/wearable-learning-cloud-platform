package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class ServerPacket extends Packet implements IPacket {

	public ServerPacket(PacketTypes packetType) {
		super(packetType);
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
		
		return byteBuffer;
	}
}
