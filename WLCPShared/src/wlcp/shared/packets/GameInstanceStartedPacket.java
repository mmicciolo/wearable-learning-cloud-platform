package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class GameInstanceStartedPacket extends Packet implements IPacket {
	
	private int gameInstanceId;
	
	public GameInstanceStartedPacket() {
		super(PacketTypes.GAME_INSTANCE_STARTED);
	}
	
	public GameInstanceStartedPacket(int gameInstanceId) {
		super(PacketTypes.GAME_INSTANCE_STARTED);
		this.gameInstanceId = gameInstanceId;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the game instance
		gameInstanceId = byteBuffer.getInt();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put the game instance
		byteBuffer.putInt(gameInstanceId);

		//Flip the buffer
		byteBuffer.flip();
		
		//Return the buffer
		return byteBuffer;
	}

	public int getGameInstanceId() {
		return gameInstanceId;
	}

	public void setGameInstanceId(int gameInstanceId) {
		this.gameInstanceId = gameInstanceId;
	}
	
}
