package wlcp.gameserver.common;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.eclipse.persistence.config.PersistenceUnitProperties;

import wlcp.model.master.Game;
import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;

public class JPAEntityManager {
	
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
	public static boolean testing = false;
	private static boolean setup = false;
	
	public JPAEntityManager() {
		Setup();
	}
	
	private void Setup() {
		if(!testing) {
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
		} else {
			//Setup an embedded db connection
			Map<String, String> TEST_CONFIG_LOCALHOST = new HashMap<String, String>();
			TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:derby:memory:DefaultDB;create=true");
			TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "org.apache.derby.jdbc.EmbeddedDriver");
			TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.TARGET_DATABASE, "Derby");
			TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.LOGGING_LEVEL, "OFF");
			if(!setup) {
				TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.DDL_GENERATION, PersistenceUnitProperties.DROP_AND_CREATE);
			}
			
			//Create a new factory using the JPA PEPDataModel
			entityManagerFactory = Persistence.createEntityManagerFactory("WLCPDataModel", TEST_CONFIG_LOCALHOST);
			
			//Create a new entity manager
			entityManager = entityManagerFactory.createEntityManager();
			
			if(!setup) {
				Username username = new Username("mmicciolo", "", "", "", "");
				GameLobby gameLobby = new GameLobby("Game Lobby", username);
				Game game = new Game("test", 3, 3, username, true, false);
				entityManager.getTransaction().begin();
				entityManager.persist(username);
				entityManager.persist(gameLobby);
				entityManager.persist(game);
				entityManager.flush();
				entityManager.getTransaction().commit();
				setup = true;
			}
		}
	}
	
	public void CleanUp() {
		entityManager.close();
		entityManagerFactory.close();
	}

	public EntityManagerFactory getEntityManagerFactory() {
		return entityManagerFactory;
	}

	public EntityManager getEntityManager() {
		return entityManager;
	}
	
}
