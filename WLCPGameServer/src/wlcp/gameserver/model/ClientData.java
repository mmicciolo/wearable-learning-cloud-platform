package wlcp.gameserver.model;

import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.util.LinkedList;

import wlcp.gameserver.modules.GameServerModule;

public class ClientData {
	
	private AsynchronousServerSocketChannel serverSocket;
	private AsynchronousSocketChannel clientSocket;
	private GameServerModule server;
	private ByteBuffer buffer;
	private boolean webSocket = false;
	public LinkedList<Byte> inputBytes = new LinkedList<Byte>();
	public int packetLength = 0;
	public int recievedPacketAmount = 0;
	public ByteBuffer byteBuffer;
	
	public ClientData(AsynchronousServerSocketChannel serverSocket, GameServerModule server) {
		this.serverSocket = serverSocket;
		this.server = server;
		buffer = ByteBuffer.allocate(65536);
	}
	
	public ClientData(AsynchronousServerSocketChannel serverSocket, AsynchronousSocketChannel clientSocket, GameServerModule server) {
		this.serverSocket = serverSocket;
		this.clientSocket = clientSocket;
		this.server = server;
		buffer = ByteBuffer.allocate(65536);
	}

	public AsynchronousServerSocketChannel getServerSocket() {
		return serverSocket;
	}

	public void setServerSocket(AsynchronousServerSocketChannel serverSocket) {
		this.serverSocket = serverSocket;
	}

	public AsynchronousSocketChannel getClientSocket() {
		return clientSocket;
	}

	public void setClientSocket(AsynchronousSocketChannel clientSocket) {
		this.clientSocket = clientSocket;
	}

	public GameServerModule getServer() {
		return server;
	}

	public void setServer(GameServerModule server) {
		this.server = server;
	}

	public ByteBuffer getBuffer() {
		return buffer;
	}

	public void setBuffer(ByteBuffer buffer) {
		this.buffer = buffer;
	}

	public boolean isWebSocket() {
		return webSocket;
	}

	public void setWebSocket(boolean webSocket) {
		this.webSocket = webSocket;
	}
	
}
