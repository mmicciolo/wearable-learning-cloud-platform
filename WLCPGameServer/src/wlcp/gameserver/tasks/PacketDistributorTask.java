package wlcp.gameserver.tasks;

import java.nio.ByteBuffer;
import java.util.concurrent.ConcurrentLinkedQueue;

import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.TaskManagerModule;
import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;
import wlcp.shared.packets.ConnectPacket;
import wlcp.shared.packets.GamePacket;
import wlcp.shared.packets.ServerPacket;
import wlcp.shared.packets.StartGameInstancePacket;

public class PacketDistributorTask extends Task implements ITask {
	
	private ConcurrentLinkedQueue<IPacket> recievedPackets;

	public PacketDistributorTask() {
		super("Packet Distributor");
		recievedPackets = new ConcurrentLinkedQueue<IPacket>();
	}
	
	public void DataRecieved(ByteBuffer byteBuffer) {
		byteBuffer.flip();
		switch(PacketTypes.values()[byteBuffer.get(0)]) {
		case START_GAME_INSTANCE:
			AddPacket(new StartGameInstancePacket(), byteBuffer);
			break;
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
	
		//Loop through all of the packets and send them off
		try {
			accquire();
			for(IPacket packet : recievedPackets) {
				if(packet instanceof GamePacket) {
					for(Task task : ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasks()) {
						if(task instanceof GameInstanceTask) {
							if(((GameInstanceTask) task).getGameInstanceId() == ((GamePacket) packet).getGameInstanceId()) {
								((GameInstanceTask) task).DistributePacket(packet);
								recievedPackets.remove(packet);
							}
						}
					}
				}
				if(packet instanceof ServerPacket) {
					for(Task task : ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasks()) {
						if(task instanceof ServerPacketHandlerTask) {
							((ServerPacketHandlerTask) task).DistributePacket(packet);
							recievedPackets.remove(packet);
						}
					}
				}
			}
			release();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void CleanUp() {
		
	}
	
	@Override 
	public void ShutDown() {
		
	}
}
