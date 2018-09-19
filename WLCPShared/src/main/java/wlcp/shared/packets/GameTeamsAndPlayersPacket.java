package wlcp.shared.packets;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class GameTeamsAndPlayersPacket extends GamePacket implements IPacket {
	
	private List<Byte> teamAndPlayerNumbers = new ArrayList<Byte>();
	
	public GameTeamsAndPlayersPacket() {
		super(PacketTypes.GAME_TEAMS_AND_PLAYERS);
	}
	
	public GameTeamsAndPlayersPacket(List<Byte> teamAndPlayerNumbers) {
		super(PacketTypes.GAME_TEAMS_AND_PLAYERS);
		this.teamAndPlayerNumbers = teamAndPlayerNumbers;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Loop through the team numbers
		for(int i = 0; i < getInt(); i++) {
			teamAndPlayerNumbers.add(getByte());
		}
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put the team numbers list length
		putInt(teamAndPlayerNumbers.size());
		
		//Put the team numbers
		for(Byte b : teamAndPlayerNumbers) {
			putByte(b);
		}
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

	public List<Byte> getTeamAndPlayerNumbers() {
		return teamAndPlayerNumbers;
	}

	public void setTeamAndPlayerNumbers(List<Byte> teamAndPlayerNumbers) {
		this.teamAndPlayerNumbers = teamAndPlayerNumbers;
	}
	
}
