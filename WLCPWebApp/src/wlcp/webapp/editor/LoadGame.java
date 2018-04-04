package wlcp.webapp.editor;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.persistence.config.HintValues;
import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.eclipse.persistence.config.QueryHints;

import com.google.gson.Gson;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.StateType;
import wlcp.model.master.transition.KeyboardInput;
import wlcp.model.master.transition.SequenceButtonPress;
import wlcp.model.master.transition.Transition;

/**
 * Servlet implementation class LoadGame
 */
@WebServlet("/LoadGame")
public class LoadGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Semaphore available = new Semaphore(1, true);
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoadGame() {
        super();
        initJPA();
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
		
		String gameId = request.getParameter("gameId");
		
		Game game = entityManager.getReference(Game.class, gameId);
		
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);

		response.getWriter().println(loadGame(game));
		response.getWriter().flush();
		
		entityManager.clear();
		
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
	
	private String loadGame(Game game) {
		Gson gson = new Gson();
		
		List<StartState> startStates = entityManager.createQuery("SELECT s FROM StartState s WHERE s.game.gameId = '" + game.getGameId() + "'", StartState.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		List<OutputState> outputStates = entityManager.createQuery("SELECT s FROM OutputState s WHERE s.game.gameId = '" + game.getGameId() + "'", OutputState.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		List<Connection> connections = entityManager.createQuery("SELECT s FROM Connection s WHERE s.game.gameId = '" + game.getGameId() + "'", Connection.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		List<Transition> transitions = entityManager.createQuery("SELECT s FROM Transition s WHERE s.game.gameId = '" + game.getGameId() + "'", Transition.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		
		for(StartState state : startStates) {
			state.setGame(null);
		}
		
		for(OutputState state : outputStates) {
			state.setGame(null);
		}
		
		for(Connection connection : connections) {
			connection.setGame(null);
		}
		
		for(Transition transition : transitions) {
			transition.setGame(null);
			for(Map.Entry<String, SequenceButtonPress> entry : transition.getSequenceButtonPresses().entrySet()) {
				entry.getValue().setTransition(null);
			}
			for(Map.Entry<String, KeyboardInput> entry : transition.getKeyboardInputs().entrySet()) {
				entry.getValue().setTransition(null);
			}
		}
		
		OutputState[] outputStateArray = new OutputState[startStates.size() + outputStates.size()];
		outputStateArray = outputStates.toArray(outputStateArray);
		outputStateArray[outputStateArray.length - 1] = new OutputState(startStates.get(0).getStateId(), startStates.get(0).getGame(), StateType.START_STATE, startStates.get(0).getPositionX(), startStates.get(0).getPositionY(), "", null);
		
		Connection[] connectionArray = new Connection[connections.size()];
		connectionArray = connections.toArray(connectionArray);
		
		Transition[] transitionArray = new Transition[transitions.size()];
		transitionArray = transitions.toArray(transitionArray);
		
		LoadSaveDataJSON loadData = new LoadSaveDataJSON();
		loadData.states = outputStateArray;
		loadData.connections = connectionArray;
		loadData.transitions = transitionArray;
		
		return gson.toJson(loadData, LoadSaveDataJSON.class);
	}

}

