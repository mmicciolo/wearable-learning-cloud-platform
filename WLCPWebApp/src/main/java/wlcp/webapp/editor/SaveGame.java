package wlcp.webapp.editor;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.persistence.config.PersistenceUnitProperties;

import com.google.gson.Gson;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.State;
import wlcp.model.master.state.StateType;
import wlcp.model.master.transition.KeyboardInput;
import wlcp.model.master.transition.SequenceButtonPress;
import wlcp.model.master.transition.SingleButtonPress;
import wlcp.model.master.transition.Transition;
/**
 * Servlet implementation class SaveGame
 */
@WebServlet("/SaveGame")
public class SaveGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Semaphore available = new Semaphore(1, true);
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SaveGame() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			available.acquire();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String text = request.getParameter("saveData");
		response.setContentType("text/plain");
		
		try {
			Gson gson = new Gson();
			LoadSaveDataJSON saveData = gson.fromJson(text, LoadSaveDataJSON.class);
			saveGame(saveData);
			response.setStatus(HttpServletResponse.SC_OK);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		
		entityManager.close();
		entityManagerFactory.close();
		available.release();
		// TODO Auto-generated method stub
		//doGet(request, response);
	}
	
	private void initJPA() {
		Map<Object, Object> properties = new HashMap<Object, Object>();
		properties.put(PersistenceUnitProperties.JDBC_URL, "jdbc:mysql://localhost/wlcp");
		properties.put(PersistenceUnitProperties.JDBC_DRIVER, "com.mysql.jdbc.Driver");
		properties.put(PersistenceUnitProperties.JDBC_USER, "wlcp");
		properties.put(PersistenceUnitProperties.JDBC_PASSWORD, "wlcp");
		properties.put("eclipselink.ddl-generation", "none");
		properties.put("eclipselink.target-database", "MySQL");
        
        //Create our factory
        entityManagerFactory = Persistence.createEntityManagerFactory("WLCPDataModel", properties);
        
        //Setup our entity manager
        entityManager = entityManagerFactory.createEntityManager();
	}
	
	private void saveGame(LoadSaveDataJSON saveData) {
		
		//Init JPA
		initJPA();
		
		//Game game = entityManager.find(Game.class, saveData.game.GameId);
		saveData.game = entityManager.find(Game.class, saveData.game.getGameId());
		
		Transition t2 = entityManager.find(Transition.class, "test_transition_1");
		
		//Loop through and save all of the states
		for(int i = 0; i < saveData.states.length; i++) {
			switch(saveData.states[i].getStateType()) {
			case START_STATE:
				entityManager.getTransaction().begin();
				entityManager.merge(new StartState(saveData.states[i].getStateId(), saveData.game, StateType.START_STATE, saveData.states[i].getPositionX(), saveData.states[i].getPositionY(), saveData.states[i].getInputConnections(), saveData.states[i].getOutputConnections()));
				entityManager.getTransaction().commit();
				break;
			case OUTPUT_STATE:
				Map<String, String> displayText = new HashMap<String, String>();
				for(Map.Entry<String, String> entry : saveData.states[i].getDisplayText().entrySet()) {
					displayText.put(entry.getKey(), entry.getValue());
				}
				entityManager.getTransaction().begin();
				entityManager.merge(new OutputState(saveData.states[i].getStateId(), saveData.game, StateType.OUTPUT_STATE, saveData.states[i].getPositionX(), saveData.states[i].getPositionY(), saveData.states[i].getInputConnections(), saveData.states[i].getOutputConnections(), saveData.states[i].getDescription(), displayText));
				entityManager.getTransaction().commit();
				break;
			}
		}
		
		//Loop through all of the connections
		for(int i = 0; i < saveData.connections.length; i++) {
			entityManager.getTransaction().begin();
			entityManager.merge(new Connection(saveData.connections[i].getConnectionId(), saveData.game, saveData.connections[i].getConnectionFrom(), saveData.connections[i].getConnectionTo(), saveData.connections[i].getBackwardsLoop(), null));
			entityManager.getTransaction().commit();
		}
		
		//Loop through all of the transitions
		for(int i = 0; i < saveData.transitions.length; i++) {
			Map<String, String> activeTransitions = new HashMap<String, String>();
			for(Map.Entry<String, String> entry : saveData.transitions[i].getActiveTransitions().entrySet()) {
				activeTransitions.put(entry.getKey(), entry.getValue());
			}
			Map<String, SingleButtonPress> singleButtonPresses = new HashMap<String, SingleButtonPress>();
			for(Map.Entry<String, SingleButtonPress> entry : saveData.transitions[i].getSingleButtonPresses().entrySet()) {
				singleButtonPresses.put(entry.getKey(), entry.getValue());
			}
			Map<String, SequenceButtonPress> sequenceButtonPresses = new HashMap<String, SequenceButtonPress>();
			for(Map.Entry<String, SequenceButtonPress> entry : saveData.transitions[i].getSequenceButtonPresses().entrySet()) {
				//sequenceButtonPresses.put(entry.getKey(), entry.getValue());
				Transition t = new Transition(); t.setTransitionId(saveData.transitions[i].getTransitionId());
				sequenceButtonPresses.put(entry.getKey(), new SequenceButtonPress(t, entry.getKey(), entry.getValue().getSequences()));
			}
			Map<String, KeyboardInput> keyboardInputs = new HashMap<String, KeyboardInput>();
			for(Map.Entry<String, KeyboardInput> entry : saveData.transitions[i].getKeyboardInputs().entrySet()) {
				Transition t = new Transition(); t.setTransitionId(saveData.transitions[i].getTransitionId());
				keyboardInputs.put(entry.getKey(), new KeyboardInput(t, entry.getKey(), entry.getValue().getKeyboardInputs()));
			}
			entityManager.getTransaction().begin();
			entityManager.merge(new Transition(saveData.transitions[i].getTransitionId(), saveData.game, saveData.transitions[i].getConnection(), new HashMap<String, String>(), new HashMap<String, SingleButtonPress>(), new HashMap<String, SequenceButtonPress>(), new HashMap<String, KeyboardInput>()));
			entityManager.flush();
			entityManager.merge(new Transition(saveData.transitions[i].getTransitionId(), saveData.game, saveData.transitions[i].getConnection(), activeTransitions, singleButtonPresses, sequenceButtonPresses, keyboardInputs));
			entityManager.getTransaction().commit();
		}
		
		//Loop through all of the connections again to add transition
		for(int i = 0; i < saveData.connections.length; i++) {
			Transition transition = null;
			try {
				transition = entityManager.getReference(Transition.class, saveData.connections[i].getTransition().getTransitionId());
			} catch(Exception e) {
				
			}
			entityManager.getTransaction().begin();
			entityManager.merge(new Connection(saveData.connections[i].getConnectionId(), saveData.game, saveData.connections[i].getConnectionFrom(), saveData.connections[i].getConnectionTo(), saveData.connections[i].getBackwardsLoop(), transition));
			entityManager.getTransaction().commit();
		}
		
		//Check if any states were deleted
		List<OutputState> outputStates = entityManager.createQuery("SELECT s FROM OutputState s WHERE s.game.gameId = '" + saveData.game.getGameId() + "'", OutputState.class).getResultList();
		for(OutputState state : outputStates) {
			boolean found = false;
			for(OutputState s : saveData.states) {
				if(state.getStateId() == s.getStateId()) {
					found = true;
				}
			}
			if(!found) {
				//delete
				entityManager.getTransaction().begin();
				entityManager.remove(entityManager.find(OutputState.class, state.getStateId()));
				entityManager.getTransaction().commit();
			}
		}
		
		//Check if any connections were deleted
		List<Connection> connections = entityManager.createQuery("SELECT s FROM Connection s WHERE s.game.gameId = '" + saveData.game.getGameId() + "'", Connection.class).getResultList();
		for(Connection connection : connections) {
			boolean found = false;
			for(Connection c : saveData.connections) {
				if(connection.getConnectionId() == c.getConnectionId()) {
					found = true;
				}
			}
			if(!found) {
				//delete
				entityManager.getTransaction().begin();
				entityManager.remove(entityManager.find(Connection.class, connection.getConnectionId()));
				entityManager.getTransaction().commit();
			}
		}
		
		//Check if any transitions were deleted
		List<Transition> transitions = entityManager.createQuery("SELECT s FROM Transition s WHERE s.game.gameId = '" + saveData.game.getGameId() + "'", Transition.class).getResultList();
		for(Transition transition : transitions) {
			boolean found = false;
			for(Transition t : saveData.transitions) {
				if(transition.getTransitionId() == t.getTransitionId()) {
					found = true;
				}
			}
			if(!found) {
				//delete
				entityManager.getTransaction().begin();
				entityManager.remove(entityManager.find(Transition.class, transition.getTransitionId()));
				entityManager.getTransaction().commit();
			}
		}
	}

}

class LoadSaveDataJSON {
	Game game;
	OutputState [] states;
	Connection [] connections;
	Transition[] transitions;
}