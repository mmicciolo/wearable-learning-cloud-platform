package wlcp.webapp.editor;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

/**
 * Servlet implementation class LoadGame
 */
@WebServlet("/LoadGame")
public class LoadGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoadGame() {
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
		String gameId = request.getParameter("gameId");
		
		initJPA();
		
		Game game = entityManager.getReference(Game.class, gameId);
		
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);

		response.getWriter().println(loadGame(game));
		response.getWriter().flush();
		
		// TODO Auto-generated method stub
		//doGet(request, response);
	}
	
	private void initJPA() {
		Map<Object, Object> properties = new HashMap<Object, Object>();
		properties.put(PersistenceUnitProperties.JDBC_URL, "jdbc:mysql://localhost/test");
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
		
		List<StartState> startStates = entityManager.createQuery("SELECT s FROM StartState s WHERE s.game.gameId = '" + game.getGameId() + "'", StartState.class).getResultList();
		List<OutputState> outputStates = entityManager.createQuery("SELECT s FROM OutputState s WHERE s.game.gameId = '" + game.getGameId() + "'", OutputState.class).getResultList();
		List<Connection> connections = entityManager.createQuery("SELECT s FROM Connection s WHERE s.game.gameId = '" + game.getGameId() + "'", Connection.class).getResultList();
		
		StateJSON[] stateJSON = new StateJSON[startStates.size() + outputStates.size()];
		ConnectionJSON[] connectionJSON = new ConnectionJSON[connections.size()];
		
		for(StartState state : startStates) {
			stateJSON[startStates.indexOf(state)] = new StateJSON();
			stateJSON[startStates.indexOf(state)].stateId = state.getStateId();
			stateJSON[startStates.indexOf(state)].game = state.getGame().getGameId();
			stateJSON[startStates.indexOf(state)].positionX = state.getPositionX();
			stateJSON[startStates.indexOf(state)].positionY = state.getPositionY();
			stateJSON[startStates.indexOf(state)].stateType = "START_STATE";
		}
		
		for(OutputState state : outputStates) {
			stateJSON[outputStates.indexOf(state) + 1] = new StateJSON();
			stateJSON[outputStates.indexOf(state) + 1].stateId = state.getStateId();
			stateJSON[outputStates.indexOf(state) + 1].game = state.getGame().getGameId();
			stateJSON[outputStates.indexOf(state) + 1].positionX = state.getPositionX();
			stateJSON[outputStates.indexOf(state) + 1].positionY = state.getPositionY();
			stateJSON[outputStates.indexOf(state) + 1].stateType = "OUTPUT_STATE";
			stateJSON[outputStates.indexOf(state) + 1].displayTextStateMap = new DisplayTextStateMapJSON[state.getDisplayText().size()];
			for(int i = 0; i < state.getDisplayText().size(); i++) {
				stateJSON[outputStates.indexOf(state) + 1].displayTextStateMap[i] = new DisplayTextStateMapJSON();
				stateJSON[outputStates.indexOf(state) + 1].displayTextStateMap[i].scope = (String)state.getDisplayText().keySet().toArray()[i];
				stateJSON[outputStates.indexOf(state) + 1].displayTextStateMap[i].displayText = (String)state.getDisplayText().values().toArray()[i];
			}
		}
		
		for(Connection connection : connections) {
			connectionJSON[connections.indexOf(connection)] = new ConnectionJSON();
			connectionJSON[connections.indexOf(connection)].gameConnectionId = connection.getGameConnectionId();
			connectionJSON[connections.indexOf(connection)].connectionFrom = connection.getConnectionFrom();
			connectionJSON[connections.indexOf(connection)].connectionTo = connection.getConnectionTo();
			connectionJSON[connections.indexOf(connection)].gameDetails = connection.getGame().getGameId();
		}
		
		LoadSaveDataJSON loadData = new LoadSaveDataJSON();
		loadData.states = stateJSON;
		loadData.connections = connectionJSON;
		
		return gson.toJson(loadData, LoadSaveDataJSON.class);
	}

}

