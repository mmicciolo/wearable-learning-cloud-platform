package wlcp.webapp.editor;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

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
import wlcp.model.master.transition.SequenceButtonPress;
import wlcp.model.master.transition.Transition;

/**
 * Servlet implementation class ExportGame
 */
@WebServlet("/ExportGame")
public class ExportGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExportGame() {
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
		
		String gameId = request.getParameter("gameId");
		
		Game game = entityManager.getReference(Game.class, gameId);
		
		List<StartState> startStates = entityManager.createQuery("SELECT s FROM StartState s WHERE s.game.gameId = '" + game.getGameId() + "'", StartState.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		List<OutputState> outputStates = entityManager.createQuery("SELECT s FROM OutputState s WHERE s.game.gameId = '" + game.getGameId() + "'", OutputState.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		List<Connection> connections = entityManager.createQuery("SELECT s FROM Connection s WHERE s.game.gameId = '" + game.getGameId() + "'", Connection.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		List<Transition> transitions = entityManager.createQuery("SELECT s FROM Transition s WHERE s.game.gameId = '" + game.getGameId() + "'", Transition.class).setHint(QueryHints.REFRESH, HintValues.TRUE).getResultList();
		
		for(OutputState state : outputStates) {
			state.getDisplayText().hashCode();
		}
		
		for(Transition transition : transitions) {
			transition.getActiveTransitions().hashCode();
			transition.getSingleButtonPresses().hashCode();
			transition.getSequenceButtonPresses().hashCode();
			for(Entry<String, SequenceButtonPress> entry : transition.getSequenceButtonPresses().entrySet()) {
				entry.getValue().getSequences().hashCode();
			}
		}
		
		GameExport gameExport = new GameExport();
		gameExport.game = game;
		gameExport.startStates = startStates;
		gameExport.outputStates = outputStates;
		gameExport.connections = connections;
		gameExport.transitions = transitions;
		
		FileOutputStream  fileOut = new FileOutputStream("C:/Users/Matt/git/wearable-learning-cloud-platform/WLCPGameServer/exports/" + gameId + ".wlcpgame");
		ObjectOutputStream out = new ObjectOutputStream(fileOut);
		out.writeObject(gameExport);
		out.close();
		fileOut.close();
		
		entityManager.clear();
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

}

class GameExport implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public Game game;
	List<StartState> startStates;
	List<OutputState> outputStates;
	List<Connection> connections;
	List<Transition> transitions;
}
