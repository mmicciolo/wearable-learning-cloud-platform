package wlcp.shared.packet;

import java.nio.ByteBuffer;

public class Packet implements IPacket{
	
	private PacketTypes packetType;
	protected ByteBuffer byteBuffer;
	
	public Packet(PacketTypes packetType) {
		this.packetType = packetType;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		this.byteBuffer = byteBuffer;
		packetType = PacketTypes.values()[byteBuffer.get()];
	}

	@Override
	public ByteBuffer assemblePacket() {
		byteBuffer = ByteBuffer.allocate(65535);
		byteBuffer.put((byte)packetType.ordinal());
		return byteBuffer;
	}
	
	/**
	 * Returns a string from a char count and a char buffer
	 * @param buffer char buffer
	 * @return string from char buffer
	 */
	public String getString() {
		String returnString = "";
		int charCount = byteBuffer.getInt();
		for(int i = 0; i < charCount; i++) {
			returnString += (char) byteBuffer.get();
		}
		return returnString;
	}

	@Override
	public PacketTypes getType() {
		return packetType;
	}

	public PacketTypes getPacketType() {
		return packetType;
	}

	public void setPacketType(PacketTypes packetType) {
		this.packetType = packetType;
	}
	
	

}
