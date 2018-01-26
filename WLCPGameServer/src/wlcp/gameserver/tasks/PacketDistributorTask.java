package wlcp.gameserver.tasks;

import java.nio.ByteBuffer;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Future;

import wlcp.gameserver.model.ClientData;
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
import wlcp.shared.packets.SingleButtonPressPacket;
import wlcp.shared.packets.StartGameInstancePacket;

class PacketClientData {
	public IPacket packet;
	public ClientData clientData;
	public PacketClientData(IPacket packet, ClientData clientData) {
		this.packet = packet;
		this.clientData = clientData;
	}
}

public class PacketDistributorTask extends Task implements ITask {
	
	private ConcurrentLinkedQueue<PacketClientData> recievedPackets;
	private ConcurrentLinkedQueue<PacketClientData> packetsToSend;

	public PacketDistributorTask() {
		super("Packet Distributor");
		recievedPackets = new ConcurrentLinkedQueue<PacketClientData>();
		packetsToSend = new ConcurrentLinkedQueue<PacketClientData>();
	}
	
	public void DataRecieved(ClientData clientData) {
		ByteBuffer byteBuffer = clientData.getBuffer();
		byteBuffer.flip();
		switch(PacketTypes.values()[byteBuffer.get(0)]) {
		case START_GAME_INSTANCE:
			AddPacket(new StartGameInstancePacket(), clientData);
			break;
		case CONNECT:
			AddPacket(new ConnectPacket(), clientData);
			break;
		case SINGLE_BUTTON_PRESS:
			AddPacket(new SingleButtonPressPacket(), clientData);
			break;
		default:
			break;
		}
	}
	
	public void AddPacket(IPacket packet, ClientData clientData) {
		try {
			accquire();
			packet.populateData(clientData.getBuffer());
			recievedPackets.add(new PacketClientData(packet, clientData));
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void AddPacketToSend(IPacket packet, ClientData clientData) {
		try {
			accquire();
			packetsToSend.add(new PacketClientData(packet, clientData));
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
	public void Update() {
	
		//Loop through all of packets recieved
		try {
			accquire();
			for(PacketClientData data : recievedPackets) {
				if(data.packet instanceof GamePacket) {
					for(Task task : ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasks()) {
						if(task instanceof GameInstanceTask) {
							if(((GameInstanceTask) task).getGameInstanceId() == ((GamePacket) data.packet).getGameInstanceId()) {
								((GameInstanceTask) task).DistributePacket(data);
								recievedPackets.remove(data);
							}
						}
					}
				}
				if(data.packet instanceof ServerPacket) {
					for(Task task : ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasks()) {
						if(task instanceof ServerPacketHandlerTask) {
							((ServerPacketHandlerTask) task).DistributePacket(data);
							recievedPackets.remove(data);
						}
					}
				}
			}
			release();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		//Loop through packet to send
		try {
			accquire();
			for(PacketClientData data : packetsToSend) {
				Future<Integer> status = data.clientData.getClientSocket().write(data.packet.assemblePacket());
				while(!status.isDone()) {}
				packetsToSend.remove(data);
			}
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
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
