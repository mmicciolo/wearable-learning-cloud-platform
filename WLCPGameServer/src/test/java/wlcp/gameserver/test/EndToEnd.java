package wlcp.gameserver.test;

import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import wlcp.shared.packet.IPacket;
import wlcp.shared.packet.PacketTypes;
import wlcp.shared.packets.ConnectAcceptedPacket;
import wlcp.shared.packets.ConnectPacket;
import wlcp.shared.packets.GameInstanceStartedPacket;
import wlcp.shared.packets.GameLobbiesPacket;
import wlcp.shared.packets.StartDebugGameInstancePacket;
import wlcp.shared.packets.StartGameInstancePacket;
import wlcp.shared.packets.StopGameInstancePacket;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

public class EndToEnd {
	
	private static TestServer ts;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		ts = new TestServer();
		ts.start();
		Thread.sleep(2500);
	}
	
	@AfterClass
	public static void tearDownAfterClass() throws InterruptedException {
		ts.shutdown();
		Thread.sleep(2500);
	}

	@Test
	public void testConnectionAndDisconnection() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		socket.close();
		assertThat(socket.isClosed(), is(equalTo(true)));
	}
	
	@Test
	public void startGameInstance() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartGameInstancePacket packet = new StartGameInstancePacket("test", 1, "mmicciolo");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_STARTED.ordinal())));
		GameInstanceStartedPacket gi = new GameInstanceStartedPacket();
		gi.populateData(data);
		StopGameInstancePacket sgipacket = new StopGameInstancePacket(gi.getGameInstanceId());
		sgipacket.assemblePacket();
		socket.getOutputStream().write(sgipacket.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		socket.close();
	}
	
	@Test
	public void startGameInstanceNoGame() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartGameInstancePacket packet = new StartGameInstancePacket("", 1, "mmicciolo");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_ERROR.ordinal())));
		socket.close();
	}
	
	@Test
	public void startGameInstanceNoGameLobby() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartGameInstancePacket packet = new StartGameInstancePacket("test", 56, "mmicciolo");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_ERROR.ordinal())));
		socket.close();
	}
	
	@Test
	public void startGameInstanceNoUser() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartGameInstancePacket packet = new StartGameInstancePacket("test", 1, "");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_ERROR.ordinal())));
		socket.close();
	}
	
	@Test
	public void startGameInstanceAlreadyStarted() throws UnknownHostException, IOException, InterruptedException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartGameInstancePacket packet = new StartGameInstancePacket("test", 1, "mmicciolo");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_STARTED.ordinal())));
		GameInstanceStartedPacket gi = new GameInstanceStartedPacket();
		gi.populateData(data);
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_ERROR.ordinal())));
		StopGameInstancePacket sgipacket = new StopGameInstancePacket(gi.getGameInstanceId());
		sgipacket.assemblePacket();
		socket.getOutputStream().write(sgipacket.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		socket.close();
	}
	
	@Test
	public void stopGameInstance() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartGameInstancePacket packet = new StartGameInstancePacket("test", 1, "mmicciolo");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_STARTED.ordinal())));
		GameInstanceStartedPacket gi = new GameInstanceStartedPacket();
		gi.populateData(data);
		StopGameInstancePacket sgipacket = new StopGameInstancePacket(gi.getGameInstanceId());
		sgipacket.assemblePacket();
		socket.getOutputStream().write(sgipacket.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_STOPPED.ordinal())));
		socket.close();
	}
	
	@Test
	public void startDebugGameInstance() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartDebugGameInstancePacket packet = new StartDebugGameInstancePacket("test", "mmicciolo", (byte) 0);
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_STARTED.ordinal())));
		GameInstanceStartedPacket gi = new GameInstanceStartedPacket();
		gi.populateData(data);
		StopGameInstancePacket sgipacket = new StopGameInstancePacket(gi.getGameInstanceId());
		sgipacket.assemblePacket();
		socket.getOutputStream().write(sgipacket.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		socket.close();
	}
	
	@Test
	public void getGameLobbies() throws UnknownHostException, IOException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		StartGameInstancePacket packet = new StartGameInstancePacket("test", 1, "mmicciolo");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_STARTED.ordinal())));
		GameInstanceStartedPacket gi = new GameInstanceStartedPacket();
		gi.populateData(data);
		
		GameLobbiesPacket glp = new GameLobbiesPacket("mmicciolo");
		glp.assemblePacket();
		socket.getOutputStream().write(glp.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_LOBBIES.ordinal())));
		
		StopGameInstancePacket sgipacket = new StopGameInstancePacket(gi.getGameInstanceId());
		sgipacket.assemblePacket();
		socket.getOutputStream().write(sgipacket.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		socket.close();
	}
	
	@Test
	public void userConnect() throws IOException, InterruptedException {
		Socket socket = new Socket("192.168.0.100", 3333);
		assertThat(socket.isConnected(), is(equalTo(true)));
		
		addGameInstance(socket);
		
		ConnectPacket connectPacket = new ConnectPacket(gameInstanceStartedPacket.getGameInstanceId(), "mmicciolo", 1, (byte) 1);
		connectPacket.assemblePacket();
		socket.getOutputStream().write(connectPacket.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.CONNECT_ACCEPTED.ordinal())));
		connectAcceptedPacket = new ConnectAcceptedPacket();
		connectAcceptedPacket.populateData(data);
		
		Thread.sleep(500);
		
		removeGameInstance(socket);
		
		socket.close();
	}
	
	static GameInstanceStartedPacket gameInstanceStartedPacket;
	static ConnectAcceptedPacket connectAcceptedPacket;
	private void addGameInstance(Socket socket) throws IOException {
		StartGameInstancePacket packet = new StartGameInstancePacket("test", 1, "mmicciolo");
		packet.assemblePacket();
		socket.getOutputStream().write(packet.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		while(socket.getInputStream().available() == 0) { }
		byte[] bytes = new byte[socket.getInputStream().available()];
		socket.getInputStream().read(bytes);
		ByteBuffer data = ByteBuffer.wrap(bytes);
		assertThat(data.get(), is(equalTo((byte)PacketTypes.GAME_INSTANCE_STARTED.ordinal())));
		gameInstanceStartedPacket = new GameInstanceStartedPacket();
		gameInstanceStartedPacket.populateData(data);
	}
	
	private void removeGameInstance(Socket socket) throws IOException, InterruptedException {
		StopGameInstancePacket sgipacket = new StopGameInstancePacket(gameInstanceStartedPacket.getGameInstanceId());
		sgipacket.assemblePacket();
		socket.getOutputStream().write(sgipacket.assembleOutputBytes().array());
		socket.getOutputStream().flush();
		Thread.sleep(500);
	}

}
