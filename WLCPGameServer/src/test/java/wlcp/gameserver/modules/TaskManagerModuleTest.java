package wlcp.gameserver.modules;

import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.LoggerModule;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class TaskManagerModuleTest {
	
	@Mock
	LoggerModule loggerModule;
	
	private static boolean setup = false;
	
	@Before
	public void before() {
		if(!setup) {
			when(loggerModule.getModule()).thenReturn(Modules.LOGGER);
			doNothing().when(loggerModule).write("");
			ModuleManager.getInstance().addModule(loggerModule);
			TaskManagerModule module = new TaskManagerModule();
			module.Setup();
			ModuleManager.getInstance().addModule(module);
			setup = true;
		}
	}
	
	@Test
	public void addAndRemoveTask() throws InterruptedException {
		TaskManagerModule module = (TaskManagerModule) ModuleManager.getInstance().getModule(Modules.TASK_MANAGER);
		TestTask task = new TestTask();
		module.addTask(task);
		Thread.sleep(100);
		assertThat(module.getTasksByType(TestTask.class), is(not(equalTo(null))));
		module.removeTask(task);
	}
}
