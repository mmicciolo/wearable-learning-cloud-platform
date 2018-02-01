package wlcp.gameserver.config;

import java.io.File;

import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.LoggerModule;

public class HeartbeatConfiguration extends Configuration implements IConfiguration {

	private boolean heartBeatEnable;
	private int heartBeatTimeoutTime;
	
	public HeartbeatConfiguration(File file) {
		super(file, Configurations.HEARTBEAT);
		SetDefaults();
	}
	
	private void SetDefaults() {
		heartBeatEnable = true;
		heartBeatTimeoutTime = 30000;
	}
	
	@Override
	public Configuration Parse() {
		heartBeatEnable = Boolean.parseBoolean(document.getElementsByTagName("HeartBeatTimeOut").item(0).getTextContent());
		heartBeatTimeoutTime = Integer.parseInt(document.getElementsByTagName("HeartbeatTimeOutTime").item(0).getTextContent());
		
		LoggerModule logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER.LOGGER);
		logger.write("Parsing Heart Beat Configuration...");
		logger.write("Heart Beat Enabled: " + String.valueOf(heartBeatEnable));
		logger.write("Heart Beat Time Out Time: " + heartBeatTimeoutTime);
		return this;
	}

	public boolean isHeartBeatEnable() {
		return heartBeatEnable;
	}

	public int getHeartBeatTimeoutTime() {
		return heartBeatTimeoutTime;
	}

}
