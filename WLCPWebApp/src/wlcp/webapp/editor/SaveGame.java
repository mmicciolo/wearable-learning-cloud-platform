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
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.State;
import wlcp.model.master.state.StateType;
/**
 * Servlet implementation class SaveGame
 */
@WebServlet("/SaveGame")
public class SaveGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
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
		String text = request.getParameter("saveData");
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		JsonObject saveData = (JsonObject)parser.parse(text);
		JsonObject game = (JsonObject)saveData.get("game");
		JsonArray states = (JsonArray)saveData.get("states");
		JsonArray connections = (JsonArray)saveData.get("connections");
		GameJSON gameJSON = gson.fromJson(game, GameJSON.class);
		StateJSON[] stateJSON = gson.fromJson(states, StateJSON[].class);
		ConnectionJSON[] connectionJSON = gson.fromJson(connections, ConnectionJSON[].class);
		saveGame(gameJSON, stateJSON, connectionJSON);
		response.setContentType("text/plain");
		response.setStatus(HttpServletResponse.SC_OK);
		// TODO Auto-generated method stub
		//doGet(request, response);
	}
	
	private void initJPA() {
		Map<Object, Object> properties = new HashMap<Object, Object>();
		properties.put(PersistenceUnitProperties.JDBC_URL, "jdbc:mysql://localhost/test");
		properties.put(PersistenceUnitProperties.JDBC_DRIVER, "com.mysql.jdbc.Driver");
		properties.put(PersistenceUnitProperties.JDBC_USER, "root");
		properties.put(PersistenceUnitProperties.JDBC_PASSWORD, "");
		properties.put("eclipselink.ddl-generation", "none");
		properties.put("eclipselink.target-database", "MySQL");
        
        //Create our factory
        entityManagerFactory = Persistence.createEntityManagerFactory("WLCPDataModel", properties);
        
        //Setup our entity manager
        entityManager = entityManagerFactory.createEntityManager();
	}
	
	private void saveGame(GameJSON gameJSON, StateJSON[] stateJSON, ConnectionJSON[] connectionJSON) {
		
		//Init JPA
		initJPA();
		
		Game game = entityManager.find(Game.class, gameJSON.GameId);
		
		//Loop through and save all of the states
		for(int i = 0; i < stateJSON.length; i++) {
			switch(stateJSON[i].stateType) {
			case "START_STATE":
				entityManager.getTransaction().begin();
				entityManager.merge(new StartState(stateJSON[i].stateId, game, StateType.START_STATE, stateJSON[i].positionX, stateJSON[i].positionY));
				entityManager.getTransaction().commit();
				break;
			case "OUTPUT_STATE":
				Map<String, String> displayText = new HashMap<String, String>();
				for(int n = 0; n < stateJSON[i].displayTextStateMap.length; n++) {
					displayText.put(stateJSON[i].displayTextStateMap[n].scope, stateJSON[i].displayTextStateMap[n].displayText);
				}
				entityManager.getTransaction().begin();
				entityManager.merge(new OutputState(stateJSON[i].stateId, game, StateType.START_STATE, stateJSON[i].positionX, stateJSON[i].positionY, displayText));
				entityManager.getTransaction().commit();
				break;
			}
		}
		
		//Loop through all of the connections
		for(int i = 0; i < connectionJSON.length; i++) {
			entityManager.getTransaction().begin();
			entityManager.merge(new Connection(game, connectionJSON[i].gameConnectionId, connectionJSON[i].connectionFrom, connectionJSON[i].connectionTo));
			entityManager.getTransaction().commit();
		}
		
	}

}

class GameJSON {
	String GameId;
	Integer TeamCount;
	Integer PlayersPerTeam;
	Integer StateIdCount;
	Boolean Visibility;
}

class StateJSON {
	String stateId;
	Float positionX;
	Float positionY;
	String game;
	String stateType;
	DisplayTextStateMapJSON[] displayTextStateMap;
	
}

class DisplayTextStateMapJSON {
	String scope;
	String displayText;
}

class ConnectionJSON {
	String gameConnectionId;
	String connectionFrom;
	String connectionTo;
	String gameDetails;
}
