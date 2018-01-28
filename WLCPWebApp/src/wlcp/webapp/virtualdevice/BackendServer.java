package wlcp.webapp.virtualdevice;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;

import wlcp.shared.packet.PacketTypes;

public class BackendServer extends Thread {

	private AsynchronousSocketChannel channel;
	private Server server;
	private int gameInstanceId;
	private int team;
	private int player;
	public ConcurrentLinkedQueue<ByteBuffer> recievedPackets;
	private final Semaphore available = new Semaphore(1, true);
	
	public BackendServer() {
		recievedPackets = new ConcurrentLinkedQueue<ByteBuffer>();
	}
	
	@Override
	public void run() {
		Connect();
	}
	
	public void Connect() {
		try {
			
			//Open up a asynch channel
			channel = AsynchronousSocketChannel.open();
			
			//Set the address
			SocketAddress serverAddress = new InetSocketAddress("127.0.0.1", 3333);
			
			//Connect
			Future<Void> connectionResult = channel.connect(serverAddress);
			
			while(!connectionResult.isDone()) { }
			
			//Did we connect?
			if(!channel.isOpen()) {
				return;
			}
			
			//Create a new container for server information
			server = new Server(channel, this);
			
			//Create a new handler to handle reads and writes
			ReadWriteHandler readWriteHandler = new ReadWriteHandler();
			
			//Go into read mode
			channel.read(server.buffer, server, readWriteHandler);
		
		} catch(Exception e) {
		e.printStackTrace();
		}
	}
	
	public void HandleVD(String command) {
		
	}
	
	public void HandlePacket(ByteBuffer byteBuffer) {
		byteBuffer.flip();
		switch(PacketTypes.values()[byteBuffer.get(0)]) {
		default:
			break;
		}
	}
	
	public void AddPacket(ByteBuffer byteBuffer) {
		try {
			accquire();
			recievedPackets.add(byteBuffer);
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void Update() {
		try {
			accquire();
			for(ByteBuffer byteBuffer : recievedPackets) {
				HandlePacket(byteBuffer);
				recievedPackets.remove(byteBuffer);
			}
			release();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void accquire() throws InterruptedException {
		available.acquire();
	}
	
	public void release() {
		available.release();
	}
	
}

class ReadWriteHandler implements CompletionHandler<Integer, Server> {
	
	  @Override
	  public void completed(Integer result, Server server) {
		  server.backendServer.recievedPackets.add(server.buffer);
		  server.buffer = ByteBuffer.allocate(65535);
		  server.serverSocket.read(server.buffer, server, this);
	  }
	  
	  @Override
	  public void failed(Throwable e, Server server) {

	  }
}

class Server {
	
	public AsynchronousSocketChannel serverSocket;
	public ByteBuffer buffer = ByteBuffer.allocate(65535);
	public BackendServer backendServer;

	public Server(AsynchronousSocketChannel serverSocket, BackendServer backendServer) {
		this.serverSocket = serverSocket;
		this.backendServer = backendServer;
	}
}
