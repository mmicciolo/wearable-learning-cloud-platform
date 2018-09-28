package wlcp.gameserver.module;

import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import wlcp.gameserver.modules.LoggerModule;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ModuleManagerTest {
	
	@Mock
	LoggerModule loggerModule;
	
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
	public void getInstance() {
		if(ModuleManager.getInstance() == null) {
			fail("Get Instance Returned Null!");
		}
	}
	
	@Test
	public void addModule() {
		Module testModule = new TestModule();
		ModuleManager.getInstance().addModule(testModule);
		assertThat(ModuleManager.getInstance().getModules(), hasItem(testModule));
		ModuleManager.getInstance().removeModule(testModule);
	}
	
	@Test 
	public void removeModule() {
		Module testModule = new TestModule();
		ModuleManager.getInstance().addModule(testModule);
		ModuleManager.getInstance().removeModule(testModule);
		assertThat(ModuleManager.getInstance().getModules().size(), is(equalTo(1)));
	}
	
	@Test
	public void getModule() {
		assertThat(ModuleManager.getInstance().getModule(Modules.LOGGER).getModule(), is(equalTo(Modules.LOGGER)));
	}
	
	@Test
	public void getModuleNegative() {
		assertThat(ModuleManager.getInstance().getModule(Modules.SERVER), is(equalTo(null)));
	}
}
