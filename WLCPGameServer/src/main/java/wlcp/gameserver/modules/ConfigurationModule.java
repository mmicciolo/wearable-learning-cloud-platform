package wlcp.gameserver.modules;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import wlcp.gameserver.config.Configurations;
import wlcp.gameserver.config.HeartbeatConfiguration;
import wlcp.gameserver.config.IConfiguration;
import wlcp.gameserver.config.ServerConfiguration;
import wlcp.gameserver.module.IModule;
import wlcp.gameserver.module.Module;
import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;

public class ConfigurationModule extends Module implements IModule {
	
	private List<IConfiguration> configurations;

	public ConfigurationModule() {
		super(Modules.CONFIGURATION);
	}
	
	@Override
	public void Setup() {
		((LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER)).write("Loading WLCP Game Server Configuration...");
		ModuleManager.getInstance().addModule(this);
		configurations = new ArrayList<IConfiguration>();
		configurations.add(new ServerConfiguration(new File("configuration/ServerConfiguration.xml")));
		configurations.add(new HeartbeatConfiguration(new File("configuration/HeartbeatConfiguration.xml")));
		ParseConfigurations();
	}
	
	private void ParseConfigurations() {
		for(IConfiguration configuration : configurations) {
			configuration.Parse();
		}
	}
	
	public IConfiguration getConfiguration(Configurations configuration) {
		for(IConfiguration config : configurations) {
			if(config.getConfiguration().equals(configuration)) {
				return config;
			}
		}
		return null;
	}
}
