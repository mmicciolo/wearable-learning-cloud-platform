package wlcp.testdata.loader;

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

import wlcp.testdata.entities.GameLobbyEntity;
import wlcp.testdata.entities.GameLobbyUsernameEntity;
import wlcp.testdata.entities.UsernameEntity;
import wlcp.testdata.entities.UsernameGameLobbyEntity;

/**
 * Servlet implementation class TestDataLoader
 */
@WebServlet("/TestDataLoader")
public class TestDataLoader extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestDataLoader() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		//Setup an embedded db connection
		Map<String, String> TEST_CONFIG_LOCALHOST = new HashMap<String, String>();
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:mysql://localhost/test");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "com.mysql.jdbc.Driver");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_USER, "wlcp");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_PASSWORD, "wlcp");
		TEST_CONFIG_LOCALHOST.put("eclipselink.ddl-generation", "drop-and-create-tables");
		TEST_CONFIG_LOCALHOST.put("eclipselink.target-database", "MySQL");
		
		//Create a new factory using the JPA PEPDataModel
		EntityManagerFactory factory = Persistence.createEntityManagerFactory("WLCPDataModel", TEST_CONFIG_LOCALHOST);
		
		//Create a new entity manager
		EntityManager manager = factory.createEntityManager();
		
		DataLoaderFactory.LoadData(new UsernameEntity(getServletContext().getResource("/TestData/Username.csv").getPath()), manager);
		DataLoaderFactory.LoadData(new GameLobbyEntity(getServletContext().getResource("/TestData/GameLobby.csv").getPath()), manager);
		DataLoaderFactory.LoadData(new UsernameGameLobbyEntity(getServletContext().getResource("/TestData/UsernameGameLobby.csv").getPath()), manager);
		DataLoaderFactory.LoadData(new GameLobbyUsernameEntity(getServletContext().getResource("/TestData/GameLobbyUsernames.csv").getPath()), manager);
		
		manager.close();
		factory.close();
		
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
