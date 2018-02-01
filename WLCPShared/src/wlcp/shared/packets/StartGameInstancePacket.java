package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class StartGameInstancePacket extends ServerPacket implements IPacket {
	
	private String gameId;
	private int gameLobbyId;

	public StartGameInstancePacket() {
		super(PacketTypes.START_GAME_INSTANCE);
	}
	
	public StartGameInstancePacket(String gameId, int gameLobbyId) {
		super(PacketTypes.START_GAME_INSTANCE);
		this.gameId = gameId;
		this.gameLobbyId = gameLobbyId;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
		
		//Populate the game id
		gameId = getString();
		
		//Populate the game lobby id
		gameLobbyId = byteBuffer.getInt();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		//Put the string length
		byteBuffer.putInt(gameId.length());
		
		//Put the game id
		byteBuffer.put(gameId.getBytes());
		
		//Put the game lobby id
		byteBuffer.putInt(gameLobbyId);
		
		//Flip the buffer
		byteBuffer.flip();
		
		return byteBuffer;
	}

	public String getGameId() {
		return gameId;
	}

	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public int getGameLobbyId() {
		return gameLobbyId;
	}

	public void setGameLobbyId(int gameLobbyId) {
		this.gameLobbyId = gameLobbyId;
	}
	
}
