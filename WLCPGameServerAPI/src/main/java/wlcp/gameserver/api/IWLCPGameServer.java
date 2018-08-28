package wlcp.gameserver.api;

import java.nio.channels.CompletionHandler;

import wlcp.shared.packet.IPacket;

public interface IWLCPGameServer {

	public <A> void connect(CompletionHandler<Void, ? super A> completionHandler, A attachment);
	public <A> void disconnect(CompletionHandler<Void, ? super A> completionHandler, A attachment);
	public <A> void SendPacket(IPacket packet, CompletionHandler<Void, ? super A> completionHandler, A attachment);
	public void registerEventListener(WLCPGameServerListener listener);
	public void getGameLobbiesForUsername(String username);
	public void getTeamsForGameLobby(int gameInstanceId, int gameLobbyId, String username);
	public void joinGameLobby(int gameInstanceId, int gameLobbyId, byte team, String username);
	public void sendSingleButtonPress(int gameInstanceId, int team, int player, int buttonPress);
	public void sendSequenceButtonPress(int gameInstanceId, int team, int player, String sequenceButtonPress);
	public void sendKeyboardInput(int gameInstanceId, int team, int player, String keyboardInput);
}
