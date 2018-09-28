package wlcp.gameserver.tasks;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import wlcp.gameserver.common.JPAEntityManager;
import wlcp.model.master.Game;
import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;
import wlcp.shared.packets.StartGameInstancePacket;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
@RunWith(MockitoJUnitRunner.class)
public class ServerPacketHandlerTaskTest {
	
	@InjectMocks
	private ServerPacketHandlerTask serverPacketHandlerTask;
	
	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	private JPAEntityManager entityManager;
	
	private static boolean setup = false;

	@Before
	public void setUp() throws Exception {
		if(!setup) {
			setup = true;
		}
	}

	@Test
	public void test() throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
//		StartGameInstancePacket packet = new StartGameInstancePacket("game", 1, "username");
//		PacketClientData packetClientData = new PacketClientData(packet, null);
//		//when(entityManager.getEntityManager().find(Game.class, Mockito.any(Object.class))).thenReturn(new Game());
//		when(entityManager.getEntityManager().find(any(), any())).thenAnswer(new Answer() {
//			@Override
//			public Object answer(InvocationOnMock invocation) throws Throwable {
//				if(Game.class == invocation.getArguments()[0]) {
//					return new Game();
//				} else if(GameLobby.class == invocation.getArguments()[0]) {
//					return new GameLobby();
//				} else if(Username.class == invocation.getArguments()[0]) {
//					return new Username();
//				}
//				return null;
//			}
//		});
//		serverPacketHandlerTask.DistributePacket(packetClientData);
//		serverPacketHandlerTask.Update();
		
		//Method privateMethod = ServerPacketHandlerTask.class.getDeclaredMethod("StartGameInstance", PacketClientData.class);
		//privateMethod.setAccessible(true);
		//privateMethod.invoke(serverPacketHandlerTask, packetClientData);
//		PacketClientData packetClientData = new PacketClientData(new StartGameInstancePacket(), null);
//		doCallRealMethod().when(serverPacketHandlerTask).DistributePacket(packetClientData);
//		doCallRealMethod().when(serverPacketHandlerTask).Update();
//		serverPacketHandlerTask.DistributePacket(packetClientData);
//		serverPacketHandlerTask.Update();
		
	}

}
