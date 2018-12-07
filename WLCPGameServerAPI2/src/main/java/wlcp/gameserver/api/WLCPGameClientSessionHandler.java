package wlcp.gameserver.api;

import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

import wlcp.shared.message.DisplayTextMessage;

public abstract class WLCPGameClientSessionHandler extends StompSessionHandlerAdapter  {
	
	protected WLCPGameClient gameClient;
	
	public WLCPGameClientSessionHandler(WLCPGameClient gameClient) {
		this.gameClient = gameClient;
	}

	@Override
    public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
		System.out.println("Connected!");
		gameClient.connectToGameInstance();
	}
	
	public void connectedToGameInstance() {
		gameClient.subscribeToChannels();
		
	}
	
	public abstract void displayTextRequest(DisplayTextMessage msg);
	public abstract void singleButtonPressRequest();
	public abstract void sequenceButtonPressRequest();
	public abstract void keyboardInputRequest();
	
}
