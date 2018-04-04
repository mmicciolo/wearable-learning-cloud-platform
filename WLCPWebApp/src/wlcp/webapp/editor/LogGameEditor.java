package wlcp.webapp.editor;

import java.io.IOException;
import java.util.HashMap;
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

import wlcp.model.log.EditorLog;
import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.StateType;
import wlcp.model.master.transition.KeyboardInput;
import wlcp.model.master.transition.SequenceButtonPress;
import wlcp.model.master.transition.SingleButtonPress;
import wlcp.model.master.transition.Transition;

/**
 * Servlet implementation class LogGameEditor
 */
@WebServlet("/LogGameEditor")
public class LogGameEditor extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Semaphore available = new Semaphore(1, true);
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogGameEditor() {
        super();
        initJPA();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
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
		Gson gson = new Gson();
		LoadSaveDataJSON saveData = gson.fromJson(text, LoadSaveDataJSON.class);
		
		//Check to see if log data already exsits
		EditorLog editorLog = entityManager.find(EditorLog.class, saveData.game.getGameId());
		
		if(editorLog == null) {
			entityManager.getTransaction().begin();
			editorLog = new EditorLog(saveData.game.getGameId(), 0);
			entityManager.persist(editorLog);
			entityManager.getTransaction().commit();
		} else {
			editorLog.setLogCount(editorLog.getLogCount() + 1);
			entityManager.getTransaction().begin();
			entityManager.merge(editorLog);
			entityManager.getTransaction().commit();
		}
		
		saveLogData(saveData, editorLog);

		response.setContentType("text/plain");
		entityManager.clear();
		
		available.release();
	}
	
	private void saveLogData(LoadSaveDataJSON saveData, EditorLog editorLog) {
		
		saveData.game = entityManager.find(Game.class, saveData.game.getGameId());
		
		//Save a log of the game
		entityManager.getTransaction().begin();
		Game game = new Game(saveData.game.getGameId() + "_log_" + editorLog.getLogCount(), saveData.game.getTeamCount(), saveData.game.getPlayersPerTeam(), saveData.game.getUsername(), saveData.game.getVisibility(), true);
		game.setStateIdCount(saveData.game.getStateIdCount());
		game.setTransitionIdCount(saveData.game.getTransitionIdCount());
		game.setConnectionIdCount(saveData.game.getConnectionIdCount());
		entityManager.persist(game);
		entityManager.getTransaction().commit();
		
		//Loop through and save all of the states
		for(int i = 0; i < saveData.states.length; i++) {
			switch(saveData.states[i].getStateType()) {
			case START_STATE:
				entityManager.getTransaction().begin();
				entityManager.merge(new StartState(saveData.states[i].getStateId() + "_log_" + editorLog.getLogCount(), game, StateType.START_STATE, saveData.states[i].getPositionX(), saveData.states[i].getPositionY()));
				entityManager.getTransaction().commit();
				break;
			case OUTPUT_STATE:
				Map<String, String> displayText = new HashMap<String, String>();
				for(Map.Entry<String, String> entry : saveData.states[i].getDisplayText().entrySet()) {
					displayText.put(entry.getKey(), entry.getValue());
				}
				entityManager.getTransaction().begin();
				entityManager.merge(new OutputState(saveData.states[i].getStateId() + "_log_" + editorLog.getLogCount(), game, StateType.OUTPUT_STATE, saveData.states[i].getPositionX(), saveData.states[i].getPositionY(), saveData.states[i].getDescription(), displayText));
				entityManager.getTransaction().commit();
				break;
			}
		}
		
		//Loop through all of the connections
		for(int i = 0; i < saveData.connections.length; i++) {
			entityManager.getTransaction().begin();
			entityManager.merge(new Connection(saveData.connections[i].getConnectionId() + "_log_" + editorLog.getLogCount(), game, saveData.connections[i].getConnectionFrom() + "_log_" + editorLog.getLogCount(), saveData.connections[i].getConnectionTo() + "_log_" + editorLog.getLogCount(), saveData.connections[i].getBackwardsLoop()));
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
			while(entityManager.getTransaction().isActive()) {}
			entityManager.getTransaction().begin();
			entityManager.merge(new Transition(saveData.transitions[i].getTransitionId() + "_log_" + editorLog.getLogCount(), game, saveData.transitions[i].getConnection() + "_log_" + editorLog.getLogCount(), new HashMap<String, String>(), new HashMap<String, SingleButtonPress>(), new HashMap<String, SequenceButtonPress>(), new HashMap<String, KeyboardInput>()));
			entityManager.flush();
			entityManager.merge(new Transition(saveData.transitions[i].getTransitionId() + "_log_" + editorLog.getLogCount(), game, saveData.transitions[i].getConnection() + "_log_" + editorLog.getLogCount(), activeTransitions, singleButtonPresses, sequenceButtonPresses, keyboardInputs));
			entityManager.getTransaction().commit();
		}
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

}
