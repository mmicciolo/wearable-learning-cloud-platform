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

import org.eclipse.persistence.config.HintValues;
import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.eclipse.persistence.config.QueryHints;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.state.State;
import wlcp.model.master.transition.Transition;

/**
 * Servlet implementation class ConvertGame
 */
@WebServlet("/ConvertGame")
public class ConvertGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConvertGame() {
        super();
        initJPA();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String gameId = request.getParameter("gameId");
		if(!gameId.equals("")) {
			Game game = entityManager.getReference(Game.class, gameId);
			convertGame(game);
		} else {
			List<Game> games = entityManager.createQuery("SELECT g FROM Game g", Game.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
			for(Game game : games) {
				convertGame(game);
			}
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
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
	
	private void convertGame(Game game) {
		List<StartState> startStates = entityManager.createQuery("SELECT s FROM StartState s WHERE s.game.gameId = '" + game.getGameId() + "'", StartState.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		List<OutputState> outputStates = entityManager.createQuery("SELECT s FROM OutputState s WHERE s.game.gameId = '" + game.getGameId() + "'", OutputState.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		
		for(State state : startStates) {
			List<Connection> outputConnections = entityManager.createQuery("SELECT c FROM Connection c WHERE c.connectionFrom = '" + state.getStateId() + "'").getResultList();
			state.setOutputConnections(outputConnections);
			entityManager.getTransaction().begin();
			state = entityManager.merge(state);
			entityManager.getTransaction().commit();
		}
		
		for(State state : outputStates) {
			List<Connection> inputConnections = entityManager.createQuery("SELECT c FROM Connection c WHERE c.connectionTo = '" + state.getStateId() + "'").getResultList();
			List<Connection> outputConnections = entityManager.createQuery("SELECT c FROM Connection c WHERE c.connectionFrom = '" + state.getStateId() + "'").getResultList();
			state.setInputConnections(inputConnections);
			state.setOutputConnections(outputConnections);
			entityManager.getTransaction().begin();
			state = entityManager.merge(state);
			entityManager.getTransaction().commit();
		}
		
		List<Connection> connections = entityManager.createQuery("SELECT s FROM Connection s WHERE s.game.gameId = '" + game.getGameId() + "'", Connection.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		for(Connection connection : connections) {
			connection.setConnectionFrom(entityManager.find(State.class, connection.getConnectionFrom()));
			connection.setConnectionTo(entityManager.find(State.class, connection.getConnectionTo()));
			List<Transition> transition = entityManager.createQuery("SELECT t FROM Transition t WHERE t.connection = '" + connection.getConnectionId() + "'").getResultList();
			if(transition.size() > 0) { transition.get(0).setConnection(connection); connection.setTransition(transition.get(0));}
			entityManager.getTransaction().begin();
			connection = entityManager.merge(connection);
			entityManager.getTransaction().commit();
		}
		
		List<Transition> transitions = entityManager.createQuery("SELECT s FROM Transition s WHERE s.game.gameId = '" + game.getGameId() + "'", Transition.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		
		
	}

}
