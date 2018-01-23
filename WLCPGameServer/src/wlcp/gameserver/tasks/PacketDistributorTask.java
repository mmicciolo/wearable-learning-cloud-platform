package wlcp.gameserver.tasks;

import java.nio.ByteBuffer;
import java.util.concurrent.ConcurrentLinkedQueue;

import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;
import wlcp.shared.packets.ConnectPacket;

public class PacketDistributorTask extends Task implements ITask {
	
	private ConcurrentLinkedQueue<IPacket> recievedPackets;

	public PacketDistributorTask() {
		super("Packet Distributor");
		recievedPackets = new ConcurrentLinkedQueue<IPacket>();
	}
	
	public void DataRecieved(ByteBuffer byteBuffer) {
		byteBuffer.flip();
		switch(PacketTypes.values()[byteBuffer.get(0)]) {
		case CONNECT:
			AddPacket(new ConnectPacket(), byteBuffer);
			break;
		default:
			break;
		}
	}
	
	public void AddPacket(IPacket packet, ByteBuffer byteBuffer) {
		try {
			accquire();
			packet.populateData(byteBuffer);
			recievedPackets.add(packet);
			System.out.println("Count: " + recievedPackets.size());
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
	public void Update() {
		
	}
	
	@Override
	public void CleanUp() {
		
	}
	
	@Override 
	public void ShutDown() {
		
	}
}
