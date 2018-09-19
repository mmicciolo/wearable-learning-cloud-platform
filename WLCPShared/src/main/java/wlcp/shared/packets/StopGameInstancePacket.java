package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class StopGameInstancePacket extends ServerPacket implements IPacket {
	
	private int gameInstanceId;

	public StopGameInstancePacket() {
		super(PacketTypes.STOP_GAME_INSTANCE);
	}
	
	public StopGameInstancePacket(int gameInstanceId) {
		super(PacketTypes.STOP_GAME_INSTANCE);
		this.gameInstanceId = gameInstanceId;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
		
		//Get the game instance id
		gameInstanceId = getInt();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		//Put the game instance
		putInt(gameInstanceId);
		
		return super.assembleOutputBytes();
	}

	public int getGameInstanceId() {
		return gameInstanceId;
	}

	public void setGameInstanceId(int gameInstanceId) {
		this.gameInstanceId = gameInstanceId;
	}

}
