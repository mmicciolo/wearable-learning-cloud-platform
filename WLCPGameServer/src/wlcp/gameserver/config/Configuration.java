package wlcp.gameserver.config;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;

import wlcp.gameserver.module.ModuleManager;
import wlcp.gameserver.module.Modules;
import wlcp.gameserver.modules.LoggerModule;

public class Configuration implements IConfiguration {
	
	private Configurations configuration;
	protected File file;
	protected DocumentBuilderFactory documentBuilderFactory;
	protected DocumentBuilder documentBuilder;
	protected Document document;

	public Configuration(File file, Configurations configuration) {
		this.file = file;
		this.configuration = configuration;
		SetupXMLParser();
	}
	
	private void SetupXMLParser() {
		try {
			documentBuilderFactory = DocumentBuilderFactory.newInstance();
			documentBuilder = documentBuilderFactory.newDocumentBuilder();
			document = documentBuilder.parse(file);
			document.getDocumentElement().normalize();
		} catch (Exception e) {
			LoggerModule logger = (LoggerModule) ModuleManager.getInstance().getModule(Modules.LOGGER);
			logger.write("Could not open server configuration xml file...");
			logger.write(e.getMessage());
			ModuleManager.getInstance().FatallyTerminateServer();
		}
	}

	@Override
	public Configuration Parse() {
		return this;
	}
	
	public Configurations getConfiguration() {
		return configuration;
	}

}
