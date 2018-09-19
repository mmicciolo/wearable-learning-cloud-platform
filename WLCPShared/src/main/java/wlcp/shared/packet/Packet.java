package wlcp.shared.packet;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

public class Packet implements IPacket{
	
	private PacketTypes packetType;
	private int packetSize;
	//protected ByteBuffer byteBuffer;
	protected ByteArrayOutputStream outputBytes;
	protected ByteArrayInputStream inputBytes;
	
	public Packet(PacketTypes packetType) {
		this.packetType = packetType;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		inputBytes = new ByteArrayInputStream(byteBuffer.array());
		packetType = PacketTypes.values()[inputBytes.read()];
		packetSize = getInt();
	}

	@Override
	public ByteBuffer assemblePacket() {
		outputBytes = new ByteArrayOutputStream();
		outputBytes.write((byte)packetType.ordinal());
		putInt(packetSize);
		return assembleOutputBytes();
	}
	
	public ByteBuffer assembleOutputBytes() {
		ByteBuffer buffer = ByteBuffer.allocate(outputBytes.size());
		buffer.put(outputBytes.toByteArray());
		packetSize = outputBytes.size();
		int oldPos = buffer.position();
		buffer.position(1);
		buffer.putInt(outputBytes.size());
		buffer.position(oldPos);
		buffer.flip();
		return buffer;
	}
	
	public void putByte(byte b) {
		outputBytes.write(b);
	}
	
	public byte getByte() {
		return (byte) inputBytes.read();
	}
	
	public void putInt(int integer) {
		outputBytes.write((integer >> 24) & 0xFF);
		outputBytes.write((integer >> 16) & 0xFF);
		outputBytes.write((integer >> 8) & 0xFF);
		outputBytes.write(integer & 0xFF);
	}
	
	public int getInt() {
		byte[] bytes = new byte[4];
		inputBytes.read(bytes, 0, 4);
		return ByteBuffer.wrap(bytes).getInt();
	}
	
	public void putString(String string) {
		putInt(string.length());
		try {
			outputBytes.write(string.getBytes());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public String getString() {
		String returnString = "";
		int charCount = getInt();
		for(int i = 0; i < charCount; i++) {
			returnString += (char) inputBytes.read();
		}
		return returnString;
	}
	
	/**
	 * Returns a string from a char count and a char buffer
	 * @param buffer char buffer
	 * @return string from char buffer
	 */
//	public String getString() {
//		String returnString = "";
//		int charCount = byteBuffer.getInt();
//		for(int i = 0; i < charCount; i++) {
//			returnString += (char) byteBuffer.get();
//		}
//		return returnString;
//	}

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

	public int getPacketSize() {
		return packetSize;
	}

}
