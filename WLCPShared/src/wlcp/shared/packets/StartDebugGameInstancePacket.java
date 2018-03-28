package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class StartDebugGameInstancePacket extends Packet implements IPacket {
	
	private String gameId;
	private String usernameId;
	
	public StartDebugGameInstancePacket() {
		super(PacketTypes.START_DEBUG_GAME_INSTANCE);
	}
	
	public StartDebugGameInstancePacket(String gameId, String usernameId) {
		super(PacketTypes.START_DEBUG_GAME_INSTANCE);
		this.gameId = gameId;
		this.usernameId = usernameId;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
		
		//Populate the game id
		gameId = getString();
		
		//Populate the username
		usernameId = getString();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		//Put the game id
		putString(gameId);
		
		//Put the username
		putString(usernameId);
		
		return super.assembleOutputBytes();
	}
}
