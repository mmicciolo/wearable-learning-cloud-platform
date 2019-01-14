package wlcp.gameserver.api;

import wlcp.shared.message.DisplayTextMessage;

public class WLCPGameServerSessionHandlerImpl extends WLCPGameClientSessionHandler {

	public WLCPGameServerSessionHandlerImpl(WLCPGameClient gameClient) {
		super(gameClient);
	}

	@Override
	public void displayTextRequest(DisplayTextMessage msg) {
		// TODO Auto-generated method stub
		System.out.println(msg.displayText);
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
