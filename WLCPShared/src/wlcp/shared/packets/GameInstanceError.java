package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class GameInstanceError extends ServerPacket implements IPacket {
	
	public enum GameInstanceErrorCode {
		GAME_DOES_NOT_EXIST,
		LOBBY_DOES_NOT_EXIST,
		USERNAME_DOES_NOT_EXIST,
		GAME_ALREADY_STARTED
	}
	
	private GameInstanceErrorCode errorCode;

	public GameInstanceError() {
		super(PacketTypes.GAME_INSTANCE_ERROR);
	}
	
	public GameInstanceError(GameInstanceErrorCode errorCode) {
		super(PacketTypes.GAME_INSTANCE_ERROR);
		this.errorCode = errorCode;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
		
		//Get the error code
		errorCode = GameInstanceErrorCode.values()[getInt()];
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		//Set the error code
		putInt(errorCode.ordinal());
		
		return super.assembleOutputBytes();
	}
}

