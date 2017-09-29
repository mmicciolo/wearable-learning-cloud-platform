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

import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;

public class DataModelTest {
	
	private static EntityManagerFactory factory;
	private static EntityManager manager;
	
	@Before
	public void setupBefore() {
		//Setup an embedded db connection
		Map<String, String> TEST_CONFIG_LOCALHOST = new HashMap<String, String>();
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:derby:memory:DefaultDB;create=true");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "org.apache.derby.jdbc.EmbeddedDriver");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.DDL_GENERATION, PersistenceUnitProperties.DROP_AND_CREATE);
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.TARGET_DATABASE, "Derby");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.LOGGING_LEVEL, "OFF");
		
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
	public void testUsernameWithoutGameLobbies() {
		
		//Create a username
		Username username = new Username("username", "password", "firstname", "lastname", "email");
		
		//Persist the username
		manager.getTransaction().begin();
		manager.persist(username);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(username, manager.getReference(Username.class, "username"));
	}
	
	@Test
	public void testUsernameWithGameLobbies() {
		
		//Create a username
		Username username = new Username("username", "password", "firstname", "lastname", "email");
		
		//Add a game lobby
		username.getGameLobbies().add(new GameLobby("gamelobby", username));
		
		//Persist the username
		manager.getTransaction().begin();
		manager.persist(username);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(username, manager.getReference(Username.class, "username"));
	}
	
	@Test(expected = javax.persistence.RollbackException.class)
	public void testGameLobbyWithoutUsername() {
		
		//Create a game lobby
		GameLobby gameLobby = new GameLobby("gamelobby", null);
		
		//Persist the lobby
		manager.getTransaction().begin();
		manager.persist(gameLobby);
		manager.getTransaction().commit();
	}
	
	@Test
	public void testGameLobbyWithUsername() {
		
		//Create a game lobby
		GameLobby gameLobby = new GameLobby("gamelobby", new Username("username", "password", "firstname", "lastname", "email"));
		
		//Persist the lobby
		manager.getTransaction().begin();
		manager.persist(gameLobby);
		manager.getTransaction().commit();
	}

//	@Test
//	public void testTeacherWithoutClasses() {
//		
//		//Create a teacher
//		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com", "Username", "Password", null);
//		
//		//Persist the teacher
//		manager.getTransaction().begin();
//		manager.persist(teacher);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(teacher, manager.getReference(Teacher.class, 1));
//	}
//	
//	@Test
//	public void testTeacherWithClasses() {
//		
//		//Create a teacher
//		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com", "Username", "Password", null);
//		teacher.getTeacherClasses().add(new TeacherClass(teacher, "A Class", 5, null, 2017, 2018));
//		
//		//Persist the teacher
//		manager.getTransaction().begin();
//		manager.persist(teacher);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(teacher, manager.getReference(Teacher.class, 1));
//	}
//	
//	@Test
//	public void testTeacherWithSchool() {
//		
//		//Create a school
//		School school = new School("School Name", "School Address");
//		
//		//Create a teacher
//		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com", "Username", "Password", school);
//		
//		//Persist the teacher
//		manager.getTransaction().begin();
//		manager.persist(teacher);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(teacher, manager.getReference(Teacher.class, 1));
//	}
//	
//	@Test
//	public void testSchool() {
//		
//		//Create a school
//		School school = new School("School Name", "School Address");
//		
//		//Persist the school
//		manager.getTransaction().begin();
//		manager.persist(school);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(school, manager.getReference(School.class, 1));
//	}
//	
//	@Test
//	public void testClassWithoutStudents() {
//		
//		//Create a school
//		School school = new School("School Name", "School Address");
//		
//		//Create a class
//		TeacherClass teacherClass = new TeacherClass(new Teacher(), "Class Name", 4, school, 2017, 2018);
//		
//		//Persist the class
//		manager.getTransaction().begin();
//		manager.persist(teacherClass);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(teacherClass, manager.getReference(TeacherClass.class, 1));
//	}
//	
//	@Test
//	public void testClassWithStudents() {
//		
//		//Create a school
//		School school = new School("School Name", "School Address");
//		
//		//Create a class
//		TeacherClass teacherClass = new TeacherClass(new Teacher(), "Class Name", 4, school, 2017, 2018);
//		
//		//Create a student
//		Student student = new Student("First Name", "Last Name", "Username", "Password", school);
//		
//		//Setup the relationship
//		student.getTeacherClasses().add(teacherClass);
//		teacherClass.getStudents().add(student);
//		
//		//Persist the class
//		manager.getTransaction().begin();
//		manager.persist(teacherClass);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(teacherClass, manager.getReference(TeacherClass.class, 1));
//	}
//	
//	@Test
//	public void testStudentWithoutClass() {
//		
//		//Create a school
//		School school = new School("School Name", "School Address");
//		
//		//Create a student
//		Student student = new Student("First Name", "Last Name", "Username", "Password", school);
//		
//		//Persist the student
//		manager.getTransaction().begin();
//		manager.persist(student);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(student, manager.getReference(Student.class, 1));
//	}
//	
//	@Test
//	public void testStudentWithClass() {
//		
//		//Create a school
//		School school = new School("School Name", "School Address");
//		
//		//Create a student
//		Student student = new Student("First Name", "Last Name", "Username", "Password", school);
//		
//		//Create a class
//		TeacherClass teacherClass = new TeacherClass(new Teacher(), "Class Name", 4, school, 2017, 2018);
//		
//		//Setup the relationship
//		student.getTeacherClasses().add(teacherClass);
//		teacherClass.getStudents().add(student);
//		
//		//Persist the student
//		manager.getTransaction().begin();
//		manager.persist(student);
//		manager.getTransaction().commit();
//		
//		//Test
//		assertEquals(student, manager.getReference(Student.class, 1));
//	}

}
