package wlcp.gameserver.tasks;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.nio.channels.CompletionHandler;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.bind.DatatypeConverter;

import wlcp.gameserver.model.ClientData;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.TaskManagerModule;
import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;
import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;
import wlcp.shared.packets.ConnectPacket;
import wlcp.shared.packets.DisconnectPacket;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.GamePacket;
import wlcp.shared.packets.GameTeamsPacket;
import wlcp.shared.packets.HeartBeatPacket;
import wlcp.shared.packets.SequenceButtonPressPacket;
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
	
	private LinkedList<PacketClientData> recievedPackets;
	private LinkedList<PacketClientData> packetsToSend;
	private final Semaphore recievedPacketsAvailable = new Semaphore(1, true);
	private final Semaphore packetsToSendAvailable = new Semaphore(1, true);

	public PacketDistributorTask() {
		super("Packet Distributor");
		recievedPackets = new LinkedList<PacketClientData>();
		packetsToSend = new LinkedList<PacketClientData>();
	}
	
	public void DataRecieved(ClientData clientData) {
		ByteBuffer byteBuffer = clientData.byteBuffer;
		byteBuffer.flip();
		PacketTypes packetType = null;
		try {
			packetType = PacketTypes.values()[byteBuffer.get(0)];
		} catch (Exception e) {
			//HandleWebSocket(clientData);
			//return;
		}
		switch(packetType) {
		case START_GAME_INSTANCE:
			AddPacket(new StartGameInstancePacket(), clientData);
			break;
		case GAME_LOBBIES:
			AddPacket(new GameLobbiesPacket(), clientData);
			break;
		case GAME_TEAMS:
			AddPacket(new GameTeamsPacket(), clientData);
			break;
		case CONNECT:
			AddPacket(new ConnectPacket(), clientData);
			break;
		case DISCONNECT:
			AddPacket(new DisconnectPacket(), clientData);
			break;
		case HEARTBEAT:
			AddPacket(new HeartBeatPacket(), clientData);
			break;
		case SINGLE_BUTTON_PRESS:
			AddPacket(new SingleButtonPressPacket(), clientData);
			break;
		case SEQUENCE_BUTTON_PRESS:
			AddPacket(new SequenceButtonPressPacket(), clientData);
			break;
		default:
			break;
		}
	}
	
	public ByteBuffer HandleSocket(ByteBuffer byteBuffer) {
		
		//Get the amount of data we need to send
		int length = byteBuffer.array().length;
		ByteBuffer bb = null;
		
		//If its more than 125 bytes, we need to use 2 bytes for the length
		if(length > 125) {
			bb = ByteBuffer.allocate(byteBuffer.array().length + 4);
			bb.put((byte) -126);
			bb.put((byte)126);
			bb.put((byte)((length >> 8) & 0xFF));
			bb.put((byte)(length & 0xFF));
		} else {
			
			//Else just use a single byte
			bb = ByteBuffer.allocate(byteBuffer.array().length + 2);
			bb.put((byte) -126);

			bb.put((byte) ((byte)byteBuffer.limit() & 127));
		}
		
		//Fill the data in the new web socket buffer
		for(int i = 0; i < byteBuffer.limit(); i++) {
			bb.put(byteBuffer.get());
		}
		
		//Send it off
		bb.flip();
		return bb;
	}
	
	public void AddPacket(IPacket packet, ClientData clientData) {
		try {
			//accquire();
			recievedPacketsAvailable.acquire();
			packet.populateData(clientData.byteBuffer);
			recievedPackets.add(new PacketClientData(packet, clientData));
			recievedPacketsAvailable.release();
			//release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void AddPacketToSend(IPacket packet, ClientData clientData) {
		try {
			packetsToSendAvailable.acquire();
			//accquire();
			packetsToSend.add(new PacketClientData(packet, clientData));
			packetsToSendAvailable.release();
			//release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
	public void Update() {
		
		//Loop through all of packets recieved
		try {
			//accquire();
			recievedPacketsAvailable.acquire();
			while(recievedPackets.size() > 0) {
				PacketClientData data = recievedPackets.removeFirst();
				if(data.packet instanceof GamePacket) {
					for(Task task : ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasksByType(GameInstanceTask.class)) {
						if(((GameInstanceTask) task).getGameInstanceId() == ((GamePacket) data.packet).getGameInstanceId()) {
							((GameInstanceTask) task).DistributePacket(data);
						}
					}
				}
				if(data.packet instanceof ServerPacket) {
					for(Task task : ((TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER)).getTasksByType(ServerPacketHandlerTask.class)) {
						((ServerPacketHandlerTask) task).DistributePacket(data);
					}
				}
			}
			recievedPacketsAvailable.release();
			//release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		int size = packetsToSend.size();
		long start = new Date().getTime();
		//Loop through packet to send
		try {
			packetsToSendAvailable.acquire();
			//accquire();
			while(packetsToSend.size() > 0) {
				PacketClientData data = packetsToSend.removeFirst();
				ByteBuffer buffer = data.packet.assemblePacket();
				if(data.clientData.isWebSocket()) { 
					buffer = HandleSocket(buffer);
				}

				//We must write until all bytes of the packet have been written
				//If this is not done, its possible not all data in the buffer is written
				int bytesWritten = 0;
				while(bytesWritten != buffer.array().length) {
					Future<Integer> status = data.clientData.getClientSocket().write(buffer);
					try {
						bytesWritten += status.get();
					} catch (Exception e) {
						//e.printStackTrace();
						break;
					}
				}
			}
			packetsToSendAvailable.release();
			//release();
		} catch(InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		float time = ((new Date().getTime() - start) / 1000.0f);
		if(time != 0.0f && size != 0) {
			float rate = size / time;
			//System.out.println("Packet rate: " + rate);
		}
	}
	
	@Override
	public void CleanUp() {
		
	}
	
	@Override 
	public void ShutDown() {
		
	}
}

class ServerWriteHandler implements CompletionHandler<Integer, ClientData> {

	@Override
	public void completed(Integer result, ClientData clientData) {
		try {
			clientData.getClientSocket().close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public void failed(Throwable exc, ClientData clientData) {
		
	}
}
