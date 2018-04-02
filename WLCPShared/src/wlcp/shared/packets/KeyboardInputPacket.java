package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class KeyboardInputPacket extends GamePacket implements IPacket {
	
	private String keyboardInput;
	
	public KeyboardInputPacket() {
		super(PacketTypes.KEYBOARD_INPUT);
	}
	
	public KeyboardInputPacket(int gameInstanceId, int team, int player, String keyboardInput) {
		super(PacketTypes.KEYBOARD_INPUT);
		this.team = team;
		this.player = player;
		this.gameInstanceId = gameInstanceId;
		this.keyboardInput = keyboardInput;
	}
	
	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method to set the packet type
		super.populateData(byteBuffer);
		
		//Get the keyboard input
		keyboardInput = getString();
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method to put the type
		super.assemblePacket();
		
		//Put the button press
		putString(keyboardInput);
		
		//Return the buffer
		return super.assembleOutputBytes();
	}

	public String getKeyboardInput() {
		return keyboardInput;
	}

	public void setKeyboardInput(String keyboardInput) {
		this.keyboardInput = keyboardInput;
	}
	
}
