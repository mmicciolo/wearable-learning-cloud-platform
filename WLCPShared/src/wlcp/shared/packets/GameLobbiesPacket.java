package wlcp.shared.packets;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class GameLobbiesPacket extends ServerPacket implements IPacket {

	private String username;
	private List<GameLobbyInfo> gameLobbyInfo = new ArrayList<GameLobbyInfo>();
	
	public GameLobbiesPacket() {
		super(PacketTypes.GAME_LOBBIES);
	}
	
	public GameLobbiesPacket(String username) {
		super(PacketTypes.GAME_LOBBIES);
		this.username = username;
	}
	
	public GameLobbiesPacket(String username,  List<GameLobbyInfo> gameLobbyInfo) {
		super(PacketTypes.GAME_LOBBIES);
		this.username = username;
		this.gameLobbyInfo = gameLobbyInfo;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the username
		username = getString();
		
		//Get the games count
		int gamesCount = byteBuffer.getInt();
		
		//Loop through all of the games
		for(int i = 0; i < gamesCount; i++) {
			gameLobbyInfo.add(new GameLobbyInfo(getString(), getString(), byteBuffer.getInt(), byteBuffer.getInt()));
		}
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Set username length
		byteBuffer.putInt(username.length());
	
		//Put the username
		byteBuffer.put(username.getBytes());
		
		//Put the games count
		byteBuffer.putInt(gameLobbyInfo.size());
		
		//Loop through all of the games
		for(GameLobbyInfo gli : gameLobbyInfo) {

			//Put game name
			byteBuffer.putInt(gli.gameName.length());
			byteBuffer.put(gli.gameName.getBytes());
			
			//Put game lobby name
			byteBuffer.putInt(gli.gameLobbyName.length());
			byteBuffer.put(gli.gameLobbyName.getBytes());
			
			//Put game lobby id
			byteBuffer.putInt(gli.gameLobbyId);
			
			//Put game instance id
			byteBuffer.putInt(gli.gameInstanceId);
		}
		
		//Flip the buffer
		byteBuffer.flip();
		
		//Return the buffer
		return byteBuffer;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public List<GameLobbyInfo> getGameLobbyInfo() {
		return gameLobbyInfo;
	}

	public void setGameLobbyInfo(List<GameLobbyInfo> gameLobbyInfo) {
		this.gameLobbyInfo = gameLobbyInfo;
	}
	
}
