package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class ConnectPacket extends GamePacket implements IPacket {
	
	private String username;
	private int selectedGameLobbyId;
	private byte teamNumber;
	
	public ConnectPacket() {
		super(PacketTypes.CONNECT);
	}
	
	public ConnectPacket(int gameInstanceId, String username, int selectedGameLobbyId, byte teamNumber) {
		super(PacketTypes.CONNECT);
		this.gameInstanceId = gameInstanceId;
		this.username = username;
		this.selectedGameLobbyId = selectedGameLobbyId;
		this.teamNumber = teamNumber;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the username
		username = getString();
		
		//Get the selected game lobby id
		selectedGameLobbyId = getInt();
		
		//Get the team number
		teamNumber = getByte();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Set username
		putString(username);
		
		//Put the selected game lobby id
		putInt(selectedGameLobbyId);
		
		//Put the team number
		putByte(teamNumber);
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getSelectedGameLobbyId() {
		return selectedGameLobbyId;
	}

	public void setSelectedGameLobbyId(int selectedGameLobbyId) {
		this.selectedGameLobbyId = selectedGameLobbyId;
	}

	public byte getTeamNumber() {
		return teamNumber;
	}

	public void setTeamNumber(byte teamNumber) {
		this.teamNumber = teamNumber;
	}

}
