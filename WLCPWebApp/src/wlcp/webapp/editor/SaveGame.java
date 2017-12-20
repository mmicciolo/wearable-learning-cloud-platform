package wlcp.webapp.editor;

import java.io.IOException;
import java.util.HashMap;
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
		LoadSaveDataJSON saveData = gson.fromJson(text, LoadSaveDataJSON.class);
		saveGame(saveData);
		response.setContentType("text/plain");
		response.setStatus(HttpServletResponse.SC_OK);
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
	
	private void saveGame(LoadSaveDataJSON saveData) {
		
		//Init JPA
		initJPA();
		
		//Game game = entityManager.find(Game.class, saveData.game.GameId);
		saveData.game = entityManager.find(Game.class, saveData.game.getGameId());
		
		//Loop through and save all of the states
		for(int i = 0; i < saveData.states.length; i++) {
			switch(saveData.states[i].getStateType()) {
			case START_STATE:
				entityManager.getTransaction().begin();
				entityManager.merge(new StartState(saveData.states[i].getStateId(), saveData.game, StateType.START_STATE, saveData.states[i].getPositionX(), saveData.states[i].getPositionY()));
				entityManager.getTransaction().commit();
				break;
			case OUTPUT_STATE:
				Map<String, String> displayText = new HashMap<String, String>();
				for(Map.Entry<String, String> entry : saveData.states[i].getDisplayText().entrySet()) {
					displayText.put(entry.getKey(), entry.getValue());
				}
				entityManager.getTransaction().begin();
				entityManager.merge(new OutputState(saveData.states[i].getStateId(), saveData.game, StateType.OUTPUT_STATE, saveData.states[i].getPositionX(), saveData.states[i].getPositionY(), displayText));
				entityManager.getTransaction().commit();
				break;
			}
		}
		
		//Loop through all of the connections
		for(int i = 0; i < saveData.connections.length; i++) {
			entityManager.getTransaction().begin();
			entityManager.merge(new Connection(saveData.connections[i].getConnectionId(), saveData.game, saveData.connections[i].getConnectionFrom(), saveData.connections[i].getConnectionTo()));
			entityManager.getTransaction().commit();
		}
		
	}

}

class LoadSaveDataJSON {
	Game game;
	OutputState [] states;
	Connection [] connections;
}
