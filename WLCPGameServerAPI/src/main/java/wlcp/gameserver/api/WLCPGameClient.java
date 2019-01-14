package wlcp.gameserver.api;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.RestTemplateXhrTransport;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import wlcp.shared.message.DisplayTextMessage;
import wlcp.shared.message.KeyboardInputMessage;
import wlcp.shared.message.SequenceButtonPressMessage;
import wlcp.shared.message.SingleButtonPressMessage;

public class WLCPGameClient {
	
	private int gameInstanceId;
	private String username;
	private int team;
	private int player;
	
	private SockJsClient sockJsClient;
	private WebSocketStompClient stompClient;
	private ListenableFuture<StompSession> stompSession;
	private WLCPGameClientSessionHandler sessionHandler;

	public WLCPGameClient(int gameInstanceId, String username, int team, int player) {
		this.gameInstanceId = gameInstanceId;
		this.username = username;
		this.team = team;
		this.player = player;
		List<Transport> transports = new ArrayList<Transport>(2);
		transports.add(new WebSocketTransport(new StandardWebSocketClient()));
		transports.add(new RestTemplateXhrTransport());
		sockJsClient = new SockJsClient(transports);
		stompClient = new WebSocketStompClient(sockJsClient);
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());
	}
	
	public void connectToGameServer(String url, WLCPGameClientSessionHandler sessionHandler) {
		this.sessionHandler = sessionHandler;
        stompSession = stompClient.connect(url, sessionHandler);
	}
	
	public void connectToGameInstance() {
		try {
			stompSession.get().subscribe("/topic/connectionResult/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return Object.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.connectedToGameInstance();
				}
			
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			stompSession.get().send("/app/gameInstance/" + gameInstanceId + "/connectToGameInstance/" + this.username + "/" + team + "/" + player, "{}");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void disconnectFromGameInstance() {
		try {
			stompSession.get().subscribe("/topic/disconnectionResult/" + username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return Object.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					try {
						stompSession.get().disconnect();
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (ExecutionException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void disconnectFromGameServer() {
		sockJsClient.stop();
	}
	
	public void subscribeToChannels() {
		try {
			stompSession.get().subscribe("/topic/gameInstance/" + gameInstanceId + "/displayText/" + this.username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return DisplayTextMessage.class;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					DisplayTextMessage msg = (DisplayTextMessage) payload;
					sessionHandler.displayTextRequest(msg);	
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			stompSession.get().subscribe("/topic/gameInstance/" + gameInstanceId + "/singleButtonPressRequest/" + this.username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return null;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.singleButtonPressRequest();
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			stompSession.get().subscribe("/topic/gameInstance/" + gameInstanceId + "/sequenceButtonPressRequest/" + this.username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return null;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.sequenceButtonPressRequest();
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			stompSession.get().subscribe("/topic/gameInstance/" + gameInstanceId + "/keyboardInputRequest/" + this.username + "/" + team + "/" + player, new StompFrameHandler() {

				public Type getPayloadType(StompHeaders headers) {
					// TODO Auto-generated method stub
					return null;
				}

				public void handleFrame(StompHeaders headers, Object payload) {
					// TODO Auto-generated method stub
					sessionHandler.keyboardInputRequest();
				}
				
			});
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendSingleButtonPress(int buttonPress) {
		SingleButtonPressMessage msg = new SingleButtonPressMessage();
		msg.buttonPress = buttonPress;
		try {
			stompSession.get().send("/app/gameInstance/" + gameInstanceId + "/singleButtonPress/" + username + "/" + team + "/" + player, msg);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendSequenceButtonPress(String sequence) {
		SequenceButtonPressMessage msg = new SequenceButtonPressMessage();
		msg.sequenceButtonPress = sequence;
		try {
			stompSession.get().send("/app/gameInstance/" + gameInstanceId + "/sequenceButtonPress/" + username + "/" + team + "/" + player, msg);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void sendKeyboardInput(String keyboardInput) {
		KeyboardInputMessage msg = new KeyboardInputMessage();
		msg.keyboardInput = keyboardInput;
		try {
			stompSession.get().send("/app/gameInstance/" + gameInstanceId + "/keyboardInput/" + username + "/" + team + "/" + player, msg);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public int getGameInstanceId() {
		return gameInstanceId;
	}

	public void setGameInstanceId(int gameInstanceId) {
		this.gameInstanceId = gameInstanceId;
	}

	public int getTeam() {
		return team;
	}

	public void setTeam(int team) {
		this.team = team;
	}

	public int getPlayer() {
		return player;
	}

	public void setPlayer(int player) {
		this.player = player;
	}

}
