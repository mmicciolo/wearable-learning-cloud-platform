package wlcp.webapp.spring.controller;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import wlcp.model.master.Game;
import wlcp.model.master.Username;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.transition.Transition;
import wlcp.webapp.spring.config.TestMVCConfig;
import wlcp.webapp.spring.config.TestPersistenceJPAConfig;

@RunWith(SpringRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = {TestPersistenceJPAConfig.class, TestMVCConfig.class})
public class LoadSaveControllerTest {
	
	@Inject
	EntityManager entityManager;
	
	@Inject
    private WebApplicationContext wac;

    private MockMvc mockMvc;
    
    private static boolean setup = false;
    
    @Before
    public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
		if (!setup) {
			//Load test data
			setup = true;
		}
    }
    
    private Game createGame() {
    	return new Game("test", 3, 3, new Username("Test", "", "", "", ""), true, false);
    }
    
    @Test
    @Transactional
    public void testLoadSaveGame() throws Exception {
    	Game game = createGame();
    	StartState state = new StartState();
    	state.setStateId("start_state");
    	state.setGame(game);
    	game.getStates().add(state);
    	entityManager.persist(game);
    	ObjectMapper objectMapper = new ObjectMapper();
    	String s = objectMapper.writeValueAsString(game);
    	System.out.println(s);
    	MvcResult result = mockMvc.perform(get("/Controllers/loadGame?gameId=test")).andExpect(status().isOk()).andReturn();
    	assertThat(result.getResponse().getContentAsString(), is(equalTo(s)));
    	mockMvc.perform(post("/Controllers/saveGame").contentType(MediaType.APPLICATION_JSON).content(s)).andExpect(status().isOk());
    }
    
    @Test
    @Transactional
    public void testLoadSaveGameState() throws Exception {
    	Game game = createGame();
    	StartState state = new StartState();
    	state.setStateId("start_state");
    	state.setGame(game);
    	game.getStates().add(state);
    	OutputState outputState = new OutputState();
    	outputState.setGame(game);
    	game.getStates().add(outputState);
    	entityManager.persist(game);
    	ObjectMapper objectMapper = new ObjectMapper();
    	String s = objectMapper.writeValueAsString(game);
    	System.out.println(s);
    	MvcResult result = mockMvc.perform(get("/Controllers/loadGame?gameId=test")).andExpect(status().isOk()).andReturn();
    	assertThat(result.getResponse().getContentAsString(), is(equalTo(s)));
    	mockMvc.perform(post("/Controllers/saveGame").contentType(MediaType.APPLICATION_JSON).content(s)).andExpect(status().isOk());
    }
    
    @Test
    @Transactional
    public void testLoadSaveGameConnection() throws Exception {
    	Game game = createGame();
    	StartState state = new StartState();
    	state.setStateId("start_state");
    	state.setGame(game);
    	game.getStates().add(state);
    	OutputState outputState = new OutputState();
    	outputState.setStateId("output_state");
    	outputState.setGame(game);
    	game.getStates().add(outputState);
    	Connection connection = new Connection("connection", game, state, outputState, false, null);
    	game.getConnections().add(connection);
    	state.getOutputConnections().add(connection);
    	outputState.getInputConnections().add(connection);
    	entityManager.persist(game);
    	entityManager.persist(connection);
    	ObjectMapper objectMapper = new ObjectMapper();
    	String s = objectMapper.writeValueAsString(game);
    	System.out.println(s);
    	MvcResult result = mockMvc.perform(get("/Controllers/loadGame?gameId=test")).andExpect(status().isOk()).andReturn();
    	assertThat(result.getResponse().getContentAsString(), is(equalTo(s)));
    	mockMvc.perform(post("/Controllers/saveGame").contentType(MediaType.APPLICATION_JSON).content(result.getResponse().getContentAsString())).andExpect(status().isOk());
    }
    
    @Test
    @Transactional
    public void testLoadGameTransition() throws Exception {
    	Game game = createGame();
    	StartState state = new StartState();
    	state.setStateId("start_state");
    	state.setGame(game);
    	game.getStates().add(state);
    	OutputState outputState = new OutputState();
    	outputState.setGame(game);
    	game.getStates().add(outputState);
    	Connection connection = new Connection("connection", game, state, outputState, false, null);
    	game.getConnections().add(connection);
    	state.getOutputConnections().add(connection);
    	outputState.getInputConnections().add(connection);
    	Transition transition = new Transition();
    	transition.setTransitionId("transition");
    	transition.setGame(game);
    	transition.setConnection(connection);
    	connection.setTransition(transition);
    	game.getTransitions().add(transition);
    	entityManager.persist(game);
    	entityManager.persist(connection);
    	entityManager.persist(transition);
    	ObjectMapper objectMapper = new ObjectMapper();
    	String s = objectMapper.writeValueAsString(game);
    	System.out.println(s);
    	MvcResult result = mockMvc.perform(get("/Controllers/loadGame?gameId=test")).andExpect(status().isOk()).andReturn();
    	assertThat(result.getResponse().getContentAsString(), is(equalTo(s)));
    	mockMvc.perform(post("/Controllers/saveGame").contentType(MediaType.APPLICATION_JSON).content(result.getResponse().getContentAsString())).andExpect(status().isOk());
    }

}
