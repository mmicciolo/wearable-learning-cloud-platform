package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class SingleButtonPressPacket extends GamePacket implements IPacket {

	private int buttonPress;
	
	public SingleButtonPressPacket() {
		super(PacketTypes.SINGLE_BUTTON_PRESS);
	}
	
	public SingleButtonPressPacket(int gameInstanceId, int team, int player, int buttonPress) {
		super(PacketTypes.SINGLE_BUTTON_PRESS);
		this.team = team;
		this.player = player;
		this.gameInstanceId = gameInstanceId;
		this.buttonPress = buttonPress;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the button press
		buttonPress = getInt();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put the button press
		putInt(buttonPress);
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

	public int getButtonPress() {
		return buttonPress;
	}

	public void setButtonPress(int buttonPress) {
		this.buttonPress = buttonPress;
	}

}
