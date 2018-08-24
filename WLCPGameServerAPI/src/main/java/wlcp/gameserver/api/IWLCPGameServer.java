package wlcp.gameserver.api;

import java.nio.channels.CompletionHandler;

import wlcp.shared.packet.IPacket;

public interface IWLCPGameServer {

	public <A> void connect(CompletionHandler<Void, ? super A> completionHandler, A attachment);
	public <A> void disconnect(CompletionHandler<Void, ? super A> completionHandler, A attachment);
	public <A> void SendPacket(IPacket packet, CompletionHandler<Void, ? super A> completionHandler, A attachment);
	public void registerEventListener(WLCPGameServerListener listener);
	public void getGameLobbiesForUsername(String username);
}
