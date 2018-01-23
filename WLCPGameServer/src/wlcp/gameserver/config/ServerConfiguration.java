package wlcp.gameserver.config;

import java.io.File;

public class ServerConfiguration extends Configuration implements IConfiguration {
	
	private String gameServerHostName;
	private int gameServerPortNumber;
	private String debugServerHostName;
	private int debugServerPortNumber;
	
	public ServerConfiguration(File file) {
		super(file);
		SetDefaults();
	}

	private void SetDefaults() {
		gameServerHostName = "0.0.0.0";
		gameServerPortNumber = 3333;
		debugServerHostName = "0.0.0.0";
		debugServerPortNumber = 3334;
	}
	
	@Override
	public Configuration Parse() {
		gameServerHostName = document.getElementsByTagName("GameServerHostName").item(0).getTextContent();
		gameServerPortNumber = Integer.parseInt(document.getElementsByTagName("GameServerPortNumber").item(0).getTextContent());
		debugServerHostName = document.getElementsByTagName("DebugServerHostName").item(0).getTextContent();
		debugServerPortNumber = Integer.parseInt(document.getElementsByTagName("DebugServerPortNumber").item(0).getTextContent());
		// TODO Auto-generated method stub
		return this;
	}

	public String getGameServerHostName() {
		return gameServerHostName;
	}

	public void setGameServerHostName(String gameServerHostName) {
		this.gameServerHostName = gameServerHostName;
	}

	public int getGameServerPortNumber() {
		return gameServerPortNumber;
	}

	public void setGameServerPortNumber(int gameServerPortNumber) {
		this.gameServerPortNumber = gameServerPortNumber;
	}

	public String getDebugServerHostName() {
		return debugServerHostName;
	}

	public void setDebugServerHostName(String debugServerHostName) {
		this.debugServerHostName = debugServerHostName;
	}

	public int getDebugServerPortNumber() {
		return debugServerPortNumber;
	}

	public void setDebugServerPortNumber(int debugServerPortNumber) {
		this.debugServerPortNumber = debugServerPortNumber;
	}
}
