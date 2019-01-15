package wlcp.gameserver.api;

import org.junit.BeforeClass;
import org.junit.Test;

public class WLCPGameClientTest {

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@Test
	public void test() {
		WLCPGameClient gameClient = new WLCPGameClient(134, "mmicciolo", 0, 0);
		gameClient.connectToGameServer("ws://localhost:3333/wlcpGameServer/0", new WLCPGameServerSessionHandlerImpl(gameClient));
		//while(true) {}
	}

}
