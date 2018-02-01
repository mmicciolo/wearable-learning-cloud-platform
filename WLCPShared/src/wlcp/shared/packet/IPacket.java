package wlcp.shared.packet;

import java.nio.ByteBuffer;

public interface IPacket {
	
	/**
	 * This method populates the packet via the byte buffer.
	 * @param byteBuffer Byte Buffer for packet
	 */
	void populateData(ByteBuffer byteBuffer);
	
	/**
	 * This method should be called to take all of the data
	 * in a packet class and turn it into a ByteBuffer for sending
	 * out into the network
	 * @return ByteBuffer to send
	 */
	ByteBuffer assemblePacket();
	
	/**
	 * Returns the type of packet based off of
	 * PacketTypes.PacketType
	 * @return PacketTypes.PacketType
	 */
	PacketTypes getType();

}
