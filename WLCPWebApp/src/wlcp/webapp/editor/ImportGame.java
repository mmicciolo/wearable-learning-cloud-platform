package wlcp.webapp.editor;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
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

import org.eclipse.persistence.config.PersistenceUnitProperties;

import wlcp.model.master.Game;
import wlcp.model.master.Username;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.transition.SequenceButtonPress;
import wlcp.model.master.transition.SingleButtonPress;
import wlcp.model.master.transition.Transition;

/**
 * Servlet implementation class ImportGame
 */
@WebServlet("/ImportGame")
public class ImportGame extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ImportGame() {
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
		
		FileInputStream  fileIn = new FileInputStream("C:/Users/Matt/git/wearable-learning-cloud-platform/WLCPGameServer/exports/" + gameId + ".wlcpgame");
		ObjectInputStream in = new ObjectInputStream(fileIn);
		GameExport gameExport = null;
		try {
			gameExport = (GameExport) in.readObject();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
			
		in.close();
		fileIn.close();
		
		entityManager.getTransaction().begin();
		Username username = entityManager.getReference(Username.class, gameExport.game.getUsername().getUsernameId());
		gameExport.game.setUsername(username);
		entityManager.persist(gameExport.game);
		entityManager.persist(gameExport.startStates.get(0));
		for(OutputState state : gameExport.outputStates) {
			entityManager.persist(state);
		}
		for(Connection connection : gameExport.connections) {
			entityManager.persist(connection);
		}
		for(Transition transition : gameExport.transitions) {
			entityManager.persist(transition);
		}
		
		entityManager.flush();
		entityManager.getTransaction().commit();
		
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

}
