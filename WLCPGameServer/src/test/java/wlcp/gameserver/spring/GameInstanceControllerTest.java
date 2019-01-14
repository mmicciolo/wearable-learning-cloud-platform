package wlcp.gameserver.spring;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import wlcp.gameserver.spring.repository.GameLobbyRepository;
import wlcp.gameserver.spring.repository.GameRepository;
import wlcp.model.master.Game;
import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;

/*//@RunWith(SpringRunner.class)
//@SpringBootTest()
//@AutoConfigureMockMvc()
//@ContextConfiguration(classes = {PersistenceJPAConfigTest.class})
//@WebMvcTest()
//@ComponentScan(basePackages = "wlcp.gameserver.spring")
@RunWith(SpringRunner.class)
//@SpringBootTest(classes = {PersistenceJPAConfigTest.class, WebSocketConfig.class, AsyncConfig.class}, webEnvironment=WebEnvironment.DEFINED_PORT)
//@EnableAutoConfiguration
@WebAppConfiguration
@EnableWebMvc
@ContextConfiguration(classes = {PersistenceJPAConfigTest.class, WebSocketConfig.class, AsyncConfig.class})
@ComponentScan(basePackages={"wlcp.gameserver.spring.controller, wlcp.gameserver.spring.service"})*/

@RunWith(SpringRunner.class)
@SpringBootTest(classes = SpringBootWebApplicationTest.class, webEnvironment=WebEnvironment.DEFINED_PORT)
//@WebAppConfiguration
public class GameInstanceControllerTest {
	
	@Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;
	
	@Autowired
	private GameRepository gameRepository;
	
	@Autowired
	private GameLobbyRepository gameLobbyRepository;
	
	//@Autowired
	//private UsernameRepository usernameRepository;
	
	//@Autowired
	//private ObjectMapper jacksonObjectMapper;
	
	//private WebSocketStompClient stompClient;
	
	private int gameInstanceId = 0;
	
	private static boolean startup = false;
	
	@Before
	public void onStartup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
		if(!startup) {
			Username username = new Username("TestUser", "", "", "", "");
			gameRepository.saveAndFlush(new Game("TestGame", 3, 3, username, false, false));
			username.setUsernameId("TestUser1");
			gameLobbyRepository.saveAndFlush(new GameLobby("TestLobby", username));
//			
//			stompClient = new WebSocketStompClient(new SockJsClient(
//					asList((Transport)new WebSocketTransport(new StandardWebSocketClient()))));
//			
			startup = true;
		}
	}
	
//	@Test
//	public void testConnect() throws Exception {
//		mockMvc.perform(get("/controllers/startGameInstance/TestGame/1/TestUser").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isOk());
//		StompSession session = stompClient.connect("http://localhost:8080/wlcpGameServer/0", new StompSessionHandlerAdapter() {}).get(1, SECONDS);
//		session.send("/app/gameInstance/1/connectToGameInstance/TestUser/0/0", "".getBytes());
//		session.subscribe("/topic/connectionResult", new StompFrameHandler () {
//
//			public Type getPayloadType(StompHeaders headers) {
//				// TODO Auto-generated method stub
//				return byte[].class;
//			}
//
//			public void handleFrame(StompHeaders headers, Object payload) {
//				ConnectResponseMessage msg;
//				try {
//					msg = jacksonObjectMapper.readValue(new String((byte[]) payload), ConnectResponseMessage.class);
//					assertThat(msg.team, is(equalTo(0)));
//					assertThat(msg.player, is(equalTo(0)));
//				} catch (JsonParseException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				} catch (JsonMappingException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//			}
//			
//		});
//		
//		while(true) { }
//	}
	
//	@Test
//	public void connectToGameServer() throws Exception {
//		startGameInstance();
//		WLCPGameClient client = new WLCPGameClient(gameInstanceId, "TestUser", 0, 0);
//		client.connectToGameServer("ws://localhost:3333/wlcpGameServer/0", new WLCPGameServerSessionHandlerTest(client));
//		while(true) { }
//	}

	@Test
	public void startGameInstanceSuccess() throws Exception {
		mockMvc.perform(get("/controllers/startGameInstance/TestGame/1/TestUser").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isOk());
		stopGameInstance();
	}
	
	@Test
	public void startGameInstanceGameDoesNotExist() throws Exception {
		mockMvc.perform(get("/controllers/startGameInstance/TestGame123/1/TestUser").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isInternalServerError());
	}
	
	@Test
	public void startGameInstanceGameLobbyDoesNotExist() throws Exception {
		mockMvc.perform(get("/controllers/startGameInstance/TestGame/2/TestUser").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isInternalServerError());
	}
	
	@Test
	public void startGameInstanceUsernameDoesNotExist() throws Exception {
		mockMvc.perform(get("/controllers/startGameInstance/TestGame/1/TestUser3").contentType(MediaType.TEXT_PLAIN)).andExpect(status().isInternalServerError());
	}
	
//	private void startGameInstance() throws Exception {
//		mockMvc.perform(get("/controllers/startGameInstance/TestGame/1/TestUser")).andReturn();
//		gameInstanceId++;
//	}
	
	private void stopGameInstance() throws Exception {
		mockMvc.perform(get("/controllers/stopGameInstance/" + gameInstanceId));
	}
}
