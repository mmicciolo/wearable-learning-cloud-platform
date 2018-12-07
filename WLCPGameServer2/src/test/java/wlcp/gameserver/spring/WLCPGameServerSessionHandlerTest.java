package wlcp.gameserver.spring;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;

import wlcp.gameserver.api.WLCPGameClient;
import wlcp.gameserver.api.WLCPGameClientSessionHandler;
import wlcp.gameserver.spring.service.GameInstanceService;
import wlcp.shared.message.DisplayTextMessage;

public class WLCPGameServerSessionHandlerTest extends WLCPGameClientSessionHandler {
	
	Logger logger = LoggerFactory.getLogger(WLCPGameServerSessionHandlerTest.class);

	public WLCPGameServerSessionHandlerTest(WLCPGameClient gameClient) {
		super(gameClient);
	}
	
	@Override
    public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
		logger.info("Connected To Game Server!");
		gameClient.connectToGameInstance();
	}
	
	@Override
	public void connectedToGameInstance() {
		logger.info("Connected To Game Instance!");
		gameClient.subscribeToChannels();
		
	}

	@Override
	public void displayTextRequest(DisplayTextMessage msg) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void singleButtonPressRequest() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void sequenceButtonPressRequest() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void keyboardInputRequest() {
		// TODO Auto-generated method stub
		
	}

}
