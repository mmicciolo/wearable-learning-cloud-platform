package wlcp.testdata.loader;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.eclipse.persistence.config.PersistenceUnitProperties;

import wlcp.model.master.Username;
import wlcp.testdata.entities.GameLobbyEntity;
import wlcp.testdata.entities.UsernameEntity;
import wlcp.testdata.entities.UsernameGameLobbyEntity;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		//Setup an embedded db connection
		Map<String, String> TEST_CONFIG_LOCALHOST = new HashMap<String, String>();
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:mysql://localhost/test");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "com.mysql.jdbc.Driver");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_USER, "root");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_PASSWORD, "");
		TEST_CONFIG_LOCALHOST.put("eclipselink.ddl-generation", "drop-and-create-tables");
		TEST_CONFIG_LOCALHOST.put("eclipselink.target-database", "MySQL");
		
		//Create a new factory using the JPA PEPDataModel
		EntityManagerFactory factory = Persistence.createEntityManagerFactory("WLCPDataModel", TEST_CONFIG_LOCALHOST);
		
		//Create a new entity manager
		EntityManager manager = factory.createEntityManager();
		
		DataLoaderFactory.LoadData(new UsernameEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\Username.csv"), manager);
		DataLoaderFactory.LoadData(new GameLobbyEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\GameLobby.csv"), manager);
		DataLoaderFactory.LoadData(new UsernameGameLobbyEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\UsernameGameLobby.csv"), manager);
		
		manager.close();
		factory.close();
	}

}
