package wlcp.gameserver.modules;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;
import org.xml.sax.SAXException;

import wlcp.gameserver.config.Configurations;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ConfigurationModuleTest {
	
	@Mock
	private LoggerModule loggerModule;
	
	@InjectMocks
	private ConfigurationModule injectedConfigurationModule;
	
	@Mock
	private DocumentBuilderFactory documentBuilderFactory;
	
	private static boolean setup = false;
	
	@Before
	public void before() {
		if(!setup) {
			when(loggerModule.getModule()).thenReturn(Modules.LOGGER);
			doNothing().when(loggerModule).write("");
			ModuleManager.getInstance().addModule(loggerModule);
			setup = true;
		}
	}
	
	@Test
	public void setupConfigurationModuleSuccess() {
		ConfigurationModule module = new ConfigurationModule();
		module.Setup();
		assertThat(ModuleManager.getInstance().getModule(Modules.CONFIGURATION), is(not(equalTo(null))));
		assertThat(module.getConfiguration(Configurations.HEARTBEAT), is(not(equalTo(null))));
		assertThat(module.getConfiguration(Configurations.SERVER), is(not(equalTo(null))));
		ModuleManager.getInstance().removeModule(module);
	}
}
