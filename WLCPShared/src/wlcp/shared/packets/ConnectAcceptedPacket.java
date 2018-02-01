package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class ConnectAcceptedPacket extends GamePacket implements IPacket {

	public ConnectAcceptedPacket() {
		super(PacketTypes.CONNECT_ACCEPTED);
	}
	
	public ConnectAcceptedPacket(int gameInstanceId, int team, int player) {
		super(PacketTypes.CONNECT_ACCEPTED);
		this.gameInstanceId = gameInstanceId;
		this.team = team;
		this.player = player;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call super
		super.populateData(byteBuffer);
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		//Flip the buffer
		byteBuffer.flip();
		
		return byteBuffer;
	}

}
