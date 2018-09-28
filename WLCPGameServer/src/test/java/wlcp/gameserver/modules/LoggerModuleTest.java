package wlcp.gameserver.modules;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.reflection.Whitebox;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.server.ServerTime;

import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class LoggerModuleTest {
	
	@InjectMocks
	private LoggerModule loggerModule;
	
	@Mock
	PrintWriter printWriter;
	
	@Mock
	ServerTime serverTime;

	private static boolean setup = false;
	
	@Before
	public void before() {
		if(!setup) {
			setup = true;
		}
	}
	
	@Test
	public void loggerModuleSetupSuccess() throws IOException {
		loggerModule = new LoggerModule();
		loggerModule.Setup();
	}
	
	@Test
	public void loggerModuleWriteSuccess() {
		loggerModule = new LoggerModule();
		loggerModule.Setup();
		loggerModule.write("Hello");
	}
	
	@Test
	public void loggerModuleWriteFailure() {
		doAnswer(new Answer<Void>() {
			@Override
			public Void answer(InvocationOnMock invocation) throws Throwable {
				throw new IOException();
			}	
		}).when(printWriter).println("Server Time 0.0: Hello");
		when(serverTime.getElapsedTime()).thenReturn(0.0);
		loggerModule.write("Hello");
	}
}
