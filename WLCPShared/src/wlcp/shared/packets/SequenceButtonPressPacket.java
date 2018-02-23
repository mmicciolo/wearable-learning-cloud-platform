package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.Packet;
import wlcp.shared.packet.PacketTypes;

public class SequenceButtonPressPacket extends GamePacket implements IPacket {
	
	private String sequenceButtonPress;
	
	public SequenceButtonPressPacket() {
		super(PacketTypes.SEQUENCE_BUTTON_PRESS);
	}
	
	public SequenceButtonPressPacket(int gameInstanceId, int team, int player, String sequenceButtonPress) {
		super(PacketTypes.SEQUENCE_BUTTON_PRESS);
		this.team = team;
		this.player = player;
		this.gameInstanceId = gameInstanceId;
		this.sequenceButtonPress = sequenceButtonPress;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the button press
		sequenceButtonPress = getString();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put the button press
		putString(sequenceButtonPress);
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

	public String getSequenceButtonPress() {
		return sequenceButtonPress;
	}

	public void setSequenceButtonPress(String sequenceButtonPress) {
		this.sequenceButtonPress = sequenceButtonPress;
	}
	
}
