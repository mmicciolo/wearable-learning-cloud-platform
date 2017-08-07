package wlcp.model.test;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import wlcp.model.master.Teacher;
import wlcp.model.master.TeacherClass;

public class DataModelTest {
	
	private static EntityManagerFactory factory;
	private static EntityManager manager;
	
	@Before
	public void setupBefore() {
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
	
	@After
	public void tearDownAfter() {
		//Close the manager
		manager.close();
		
		//Closer the factory
		factory.close();
	}

	@Test
	public void testTeacherWithoutClasses() {
		
		//Create a teacher
		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com");
		
		//Persist the teacher
		manager.getTransaction().begin();
		manager.persist(teacher);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(teacher, manager.getReference(Teacher.class, 1));
	}
	
	@Test
	public void testTeacherWithClasses() {
		//Create a teacher
		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com");
		teacher.getTeacherClasses().add(new TeacherClass(teacher, "A Class", 5, "A School", 2017, 2018));
		
		//Persist the teacher
		manager.getTransaction().begin();
		manager.persist(teacher);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(teacher, manager.getReference(Teacher.class, 1));
	}

}
