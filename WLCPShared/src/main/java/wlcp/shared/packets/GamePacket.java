package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class GamePacket extends Packet implements IPacket {

	protected int gameInstanceId;
	protected int team;
	protected int player;
	
	public GamePacket(PacketTypes packetType) {
		super(packetType);
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
		
		//Set the game instance id
		gameInstanceId = getInt();
		
		//Get the team
		team = getInt();
		
		//Get the player
		player = getInt();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put the game instance id
		putInt(gameInstanceId);
		
		//Put the team
		putInt(team);
		
		//Put the player
		putInt(player);
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

	public int getGameInstanceId() {
		return gameInstanceId;
	}

	public void setGameInstanceId(int gameInstanceId) {
		this.gameInstanceId = gameInstanceId;
	}

	public int getTeam() {
		return team;
	}

	public void setTeam(int team) {
		this.team = team;
	}

	public int getPlayer() {
		return player;
	}

	public void setPlayer(int player) {
		this.player = player;
	}

}
