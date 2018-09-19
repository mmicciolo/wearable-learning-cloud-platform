package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class DisplayTextPacket extends GamePacket implements IPacket {

	private String displayText;
	
	public DisplayTextPacket() {
		super(PacketTypes.DISPLAY_TEXT);
	}
	
	public DisplayTextPacket(String displayText) {
		super(PacketTypes.DISPLAY_TEXT);
		this.displayText = displayText;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the display text
		displayText = getString();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put display text
		putString(displayText);
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

	public String getDisplayText() {
		return displayText;
	}

	public void setDisplayText(String displayText) {
		this.displayText = displayText;
	}
	
}
