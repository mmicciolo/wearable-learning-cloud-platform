package wlcp.shared.packets;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class GameTeamsPacket extends GamePacket implements IPacket {

	private int gameLobbyId;
	private String username;
	private List<Byte> teamNumbers = new ArrayList<Byte>();
	
	public GameTeamsPacket() {
		super(PacketTypes.GAME_TEAMS);
	}
	
	public GameTeamsPacket(String username, List<Byte> teamNumbers) {
		super(PacketTypes.GAME_TEAMS);
		this.username = username;
		this.teamNumbers = teamNumbers;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the game lobby id
		gameLobbyId = byteBuffer.getInt();
		
		//Get the username
		username = getString();
		
		//Loop through the team numbers
		for(int i = 0; i < byteBuffer.get(); i++) {
			teamNumbers.add(byteBuffer.get());
		}
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put the game lobby id
		byteBuffer.putInt(gameLobbyId);
		
		//Put the username length
		byteBuffer.putInt(username.length());
		
		//Put the username
		byteBuffer.put(username.getBytes());
		
		//Put the team numbers list length
		byteBuffer.putInt(teamNumbers.size());
		
		//Put the team numbers
		for(Byte b : teamNumbers) {
			byteBuffer.put(b);
		}
		
		//Flip the buffer
		byteBuffer.flip();
		
		//Return the buffer
		return byteBuffer;
	}

	public int getGameLobbyId() {
		return gameLobbyId;
	}

	public void setGameLobbyId(int gameLobbyId) {
		this.gameLobbyId = gameLobbyId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public List<Byte> getTeamNumbers() {
		return teamNumbers;
	}

	public void setTeamNumbers(List<Byte> teamNumbers) {
		this.teamNumbers = teamNumbers;
	}

}
