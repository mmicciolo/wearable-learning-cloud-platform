package wlcp.gameserver.modules;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

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
		configurations = new ArrayList<IConfiguration>();
		configurations.add(new ServerConfiguration(new File("configuration/ServerConfiguration.xml")));
		ParseConfigurations();
	}
	
	private void ParseConfigurations() {
		for(IConfiguration configuration : configurations) {
			configuration.Parse();
		}
	}
}
