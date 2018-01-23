package wlcp.gameserver.modules;

import java.io.File;
import java.io.PrintWriter;

import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.server.ServerTime;


public class LoggerModule extends Module implements IModule {
	
	private PrintWriter writer;
	private ServerTime serverTime;
	
	public LoggerModule() {
		super(Modules.LOGGER);
	}
	
	@Override
	public void Setup() {
		try {
			File file = new File("wlbelog.log");
			file.createNewFile();
			writer = new PrintWriter(file);
		} catch (Exception e) {
			System.out.println("Could not open log file for writing...");
			System.out.println("Server Time " + (serverTime.getElapsedTime() / 1000.0f) + ": " + e.getMessage());
			ModuleManager.getInstance().FatallyTerminateServer();
		}
		serverTime = new ServerTime();
		write("Starting Module Manager...");
		write("Module Manager Started...");
		ModuleManager.getInstance().addModule(this);
	}
	
	@Override
	public void CleanUp() {
		writer.close();
	}
	
	public void write(String output) {
		try {
			accquire();
			String concat = ConcatLine(output);
			writer.println(concat);
			writer.flush();
			System.out.println(concat);
			release();
		} catch (Exception e) {
			System.out.println("Could write to log...");
			System.out.println("Server Time " + (serverTime.getElapsedTime() / 1000.0f) + ": " + e.getMessage());
		}
	}
	
	private String ConcatLine(String output) {
		return "Server Time " + (serverTime.getElapsedTime() / 1000.0f) + ": " + output;
	}
}
