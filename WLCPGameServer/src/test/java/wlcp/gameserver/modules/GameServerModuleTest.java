package wlcp.gameserver.modules;

import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.reflection.Whitebox;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import wlcp.gameserver.model.ClientData;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.LoggerModule;
import wlcp.gameserver.tasks.PacketDistributorTask;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousCloseException;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.util.ArrayList;
import java.util.List;

import wlcp.gameserver.modules.GameServerModule.ServerConnectionHandler;
import wlcp.gameserver.modules.GameServerModule.ServerReadHandler;

@RunWith(MockitoJUnitRunner.class)
public class GameServerModuleTest {
	
	@Mock
	LoggerModule loggerModule;
	
	@Mock
	ConfigurationModule configurationModule;
	
	@Mock
	TaskManagerModule taskManagerModule;
	
	@Mock
	PacketDistributorTask packetDistributorTask;
	
	@InjectMocks
	ClientData clientData;
	
	@Mock
	AsynchronousServerSocketChannel serverSocket;
	
	@Mock
	AsynchronousSocketChannel clientSocket;
	
	private static boolean setup = false;
	
	@Before
	public void before() throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException {
		if(!setup) {
			Field f = ModuleManager.class.getDeclaredField("modules");
			f.setAccessible(true);
			f.set(null, new ArrayList<Module>());
			when(loggerModule.getModule()).thenReturn(Modules.LOGGER);
			doNothing().when(loggerModule).write("");
			ModuleManager.getInstance().addModule(loggerModule);
			configurationModule = new ConfigurationModule();
			configurationModule.Setup();
			taskManagerModule = new TaskManagerModule();
			taskManagerModule.Setup();
			taskManagerModule.addTask(new PacketDistributorTask());
			ModuleManager.getInstance().addModule(taskManagerModule);
			setup = true;
		}
	}
	
	@Test
	public void setupGameServerSuccess() {
		GameServerModule module = new GameServerModule();
		module.Setup();
	}
	
	@Test
	public void setupGameServerFailure() {
		
	}
	
	@Test
	public void connectionAcceptedSuccess() {
		GameServerModule module = new GameServerModule();
		Whitebox.setInternalState(module, "logger", loggerModule);
		clientData = new ClientData(serverSocket, null, module);
		when(serverSocket.accept()).thenReturn(null);
		when(clientSocket.read(null)).thenReturn(null);
		ServerConnectionHandler handler = module.new ServerConnectionHandler();
		handler.completed(clientSocket, clientData);
		assertThat(module.getClients().size(), is(equalTo(1)));
	}
	
	@Test
	public void connectionAcceptedFailure() {
		
	}
	
	@Test
	public void readDataSuccess3Bytes() {
		GameServerModule module = new GameServerModule();
		Whitebox.setInternalState(module, "logger", loggerModule);
		when(clientSocket.read(null)).thenReturn(null);
		clientData = new ClientData(serverSocket, clientSocket, module);
		ByteBuffer buffer = ByteBuffer.allocate(3);
		buffer.put(new byte[] {0, 0, 0});
		clientData.setBuffer(buffer);
		ServerReadHandler handler = module.new ServerReadHandler();
		handler.completed(buffer.limit(), clientData);
		buffer = ByteBuffer.allocate(3);
		buffer.put(new byte[] {0, 1, 0});
		clientData.setBuffer(buffer);
		handler.completed(buffer.limit(), clientData);
	}
	
	@Test
	public void readDataFailure() {
		GameServerModule module = new GameServerModule();
		Whitebox.setInternalState(module, "logger", loggerModule);
		when(clientSocket.read(null)).thenReturn(null);
		clientData = new ClientData(serverSocket, clientSocket, module);
		ServerReadHandler handler = module.new ServerReadHandler();
		handler.completed(-1, clientData);
	}
	
	@Test
	public void readDataFailureSocketAsynchronousCloseException() {
		GameServerModule module = new GameServerModule();
		Whitebox.setInternalState(module, "logger", loggerModule);
		when(clientSocket.read(null)).thenReturn(null);
		clientData = new ClientData(serverSocket, clientSocket, module);
		ServerReadHandler handler = module.new ServerReadHandler();
		handler.failed(new AsynchronousCloseException(), clientData);
	}
	
	@Test
	public void readDataFailureSocketIOException() {
		GameServerModule module = new GameServerModule();
		Whitebox.setInternalState(module, "logger", loggerModule);
		when(clientSocket.read(null)).thenReturn(null);
		clientData = new ClientData(serverSocket, clientSocket, module);
		ServerReadHandler handler = module.new ServerReadHandler();
		handler.failed(new IOException(), clientData);
	}
	
	@Test
	public void WebSocketHandShake() {
		GameServerModule module = new GameServerModule();
		Whitebox.setInternalState(module, "logger", loggerModule);
		when(clientSocket.read(null)).thenReturn(null);
		clientData = new ClientData(serverSocket, clientSocket, module);
		String request = "GET / HTTP/1.1 \r\n" + "Sec-WebSocket-Key: jMO6q42G2DCi2lS2ccfrwQ==" + "\r\n\r\n";
		ByteBuffer buffer = ByteBuffer.allocate(request.length());
		buffer.put(request.getBytes());
		clientData.setBuffer(buffer);
		ServerReadHandler handler = module.new ServerReadHandler();
		handler.completed(buffer.limit(), clientData);
	}
	
	@Test
	public void WebSocketPacket() {
		GameServerModule module = new GameServerModule();
		Whitebox.setInternalState(module, "logger", loggerModule);
		when(clientSocket.read(null)).thenReturn(null);
		clientData = new ClientData(serverSocket, clientSocket, module);
		ByteBuffer buffer = ByteBuffer.allocate(1);
		clientData.setBuffer(buffer);
		ServerReadHandler handler = module.new ServerReadHandler();
		//handler.completed(buffer.limit(), clientData);
	}
}
