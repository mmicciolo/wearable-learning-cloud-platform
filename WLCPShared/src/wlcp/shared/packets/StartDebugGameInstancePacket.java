package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class StartDebugGameInstancePacket extends ServerPacket implements IPacket {
	
	private String gameId;
	private String usernameId;
	private byte restartDebug;
	
	public StartDebugGameInstancePacket() {
		super(PacketTypes.START_DEBUG_GAME_INSTANCE);
	}
	
	public StartDebugGameInstancePacket(String gameId, String usernameId, byte restartDebug) {
		super(PacketTypes.START_DEBUG_GAME_INSTANCE);
		this.gameId = gameId;
		this.usernameId = usernameId;
		this.restartDebug = restartDebug;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
		
		//Populate the game id
		gameId = getString();
		
		//Populate the username
		usernameId = getString();
		
		//Populate restart debug
		restartDebug = getByte();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		//Put the game id
		putString(gameId);
		
		//Put the username
		putString(usernameId);
		
		//Put the restart debug
		putByte(restartDebug);
		
		return super.assembleOutputBytes();
	}

	public String getGameId() {
		return gameId;
	}

	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public String getUsernameId() {
		return usernameId;
	}

	public void setUsernameId(String usernameId) {
		this.usernameId = usernameId;
	}

	public byte getRestartDebug() {
		return restartDebug;
	}

	public void setRestartDebug(byte restartDebug) {
		this.restartDebug = restartDebug;
	}
	
}
