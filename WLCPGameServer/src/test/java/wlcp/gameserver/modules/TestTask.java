package wlcp.gameserver.modules;

import wlcp.gameserver.task.ITask;
import wlcp.gameserver.task.Task;

public class TestTask extends Task implements ITask {

	public TestTask() {
		super("test task");
	}

}
