package wlcp.model.test;

import static org.junit.Assert.*;

import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import wlcp.model.master.SchoolClass;
import wlcp.model.master.Teacher;

public class DataModelTest {
	
	private static EntityManagerFactory factory;
	private static EntityManager manager;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		
		//Setup an embedded db connection
		Map<String, String> TEST_CONFIG_LOCALHOST = new HashMap<String, String>();
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:mysql://localhost/test");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "com.mysql.jdbc.Driver");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_USER, "root");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_PASSWORD, "");
		//TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:derby:memory:DefaultDB;create=true");
		//TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "org.apache.derby.jdbc.EmbeddedDriver");
		//TEST_CONFIG_LOCALHOST.put("eclipselink.ddl-generation", "drop-and-create-tables");
		TEST_CONFIG_LOCALHOST.put("eclipselink.ddl-generation", "drop-and-create-tables");
		//TEST_CONFIG_LOCALHOST.put("eclipselink.target-database", "Derby");
		TEST_CONFIG_LOCALHOST.put("eclipselink.target-database", "MySQL");
		
		//Create a new factory using the JPA PEPDataModel
		factory = Persistence.createEntityManagerFactory("WLCPDataModel", TEST_CONFIG_LOCALHOST);
		
		//Create a new entity manager
		manager = factory.createEntityManager();
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		
		//Close the manager
		manager.close();
		
		//Closer the factory
		factory.close();
	}
	
	@Test
	public void test() {
		int i = 0;
	}
	
//	@Test
//	public void testTeacher() {
//		
//		//Create a teacher
//		Teacher testTeacher = DataModelTestMethods.CreateTeacher();
//		
//		//Start the transactions
//		manager.getTransaction().begin();
//		
//		//Persist the teacher
//		manager.persist(testTeacher);
//		
//		//Commit the entity
//		manager.getTransaction().commit();
//		
//		//Get the persisted teacher
//		Teacher persistedTeacher = manager.getReference(Teacher.class, 1);
//		
//		//Compare
//		assertEquals(testTeacher, persistedTeacher);
//	}
//	
//	@Test
//	public void testSchoolClass() {
//		
//		//Create a class
//		SchoolClass testSchoolClass = DataModelTestMethods.CreateSchoolClass();
//		
//		//Start the transaction
//		manager.getTransaction().begin();
//		
//		//Persist the class
//		manager.persist(testSchoolClass);
//		
//		//Commit the entity
//		manager.getTransaction().commit();
//		
//		//Get the persisted class
//		SchoolClass persistedSchoolClass = manager.getReference(SchoolClass.class, 1);
//		
//		//Compare
//		assertEquals(testSchoolClass, persistedSchoolClass);
//	}

}
