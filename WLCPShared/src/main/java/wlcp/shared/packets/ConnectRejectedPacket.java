package wlcp.shared.packets;

import java.nio.ByteBuffer;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;

public class ConnectRejectedPacket extends GamePacket implements IPacket {
	
	public enum ConnectRejectedErrorCode {
		TEAM_FULL
	}
	
	private ConnectRejectedErrorCode errorCode;

	public ConnectRejectedPacket() {
		super(PacketTypes.CONNECT_REJECTED);
	}
	
	public ConnectRejectedPacket(ConnectRejectedErrorCode errorCode) {
		super(PacketTypes.CONNECT_REJECTED);
		this.errorCode = errorCode;
	}

	@Override
	public void populateData(ByteBuffer byteBuffer) {
		
		//Call the super method
		super.populateData(byteBuffer);
		
		//Get the error code
		errorCode = ConnectRejectedErrorCode.values()[getInt()];
	}

	@Override
	public ByteBuffer assemblePacket() {
		
		//Call the super method
		super.assemblePacket();
		
		//Set the error code
		putInt(errorCode.ordinal());
		
		return super.assembleOutputBytes();
	}

}
