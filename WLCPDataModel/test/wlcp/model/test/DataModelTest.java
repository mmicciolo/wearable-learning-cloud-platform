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

import wlcp.model.master.School;
import wlcp.model.master.Student;
import wlcp.model.master.Teacher;
import wlcp.model.master.TeacherClass;

public class DataModelTest {
	
	private static EntityManagerFactory factory;
	private static EntityManager manager;
	
	@Before
	public void setupBefore() {
		//Setup an embedded db connection
		Map<String, String> TEST_CONFIG_LOCALHOST = new HashMap<String, String>();
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:derby:memory:DefaultDB;create=true");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "org.apache.derby.jdbc.EmbeddedDriver");
		TEST_CONFIG_LOCALHOST.put("eclipselink.ddl-generation", "drop-and-create-tables");
		TEST_CONFIG_LOCALHOST.put("eclipselink.target-database", "Derby");
		
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
		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com", "Password", null);
		
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
		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com", "Password", null);
		teacher.getTeacherClasses().add(new TeacherClass(teacher, "A Class", 5, null, 2017, 2018));
		
		//Persist the teacher
		manager.getTransaction().begin();
		manager.persist(teacher);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(teacher, manager.getReference(Teacher.class, 1));
	}
	
	@Test
	public void testTeacherWithSchool() {
		
		//Create a school
		School school = new School("School Name", "School Address");
		
		//Create a teacher
		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com", "Password", school);
		
		//Persist the teacher
		manager.getTransaction().begin();
		manager.persist(teacher);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(teacher, manager.getReference(Teacher.class, 1));
	}
	
	@Test
	public void testSchool() {
		
		//Create a school
		School school = new School("School Name", "School Address");
		
		//Persist the school
		manager.getTransaction().begin();
		manager.persist(school);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(school, manager.getReference(School.class, 1));
	}
	
	@Test
	public void testClassWithoutStudents() {
		
		//Create a school
		School school = new School("School Name", "School Address");
		
		//Create a class
		TeacherClass teacherClass = new TeacherClass(new Teacher(), "Class Name", 4, school, 2017, 2018);
		
		//Persist the class
		manager.getTransaction().begin();
		manager.persist(teacherClass);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(teacherClass, manager.getReference(TeacherClass.class, 1));
	}
	
	@Test
	public void testClassWithStudents() {
		
		//Create a school
		School school = new School("School Name", "School Address");
		
		//Create a class
		TeacherClass teacherClass = new TeacherClass(new Teacher(), "Class Name", 4, school, 2017, 2018);
		
		//Create a student
		Student student = new Student("First Name", "Last Name", "Username", "Password", school);
		
		//Setup the relationship
		student.getTeacherClasses().add(teacherClass);
		teacherClass.getStudents().add(student);
		
		//Persist the class
		manager.getTransaction().begin();
		manager.persist(teacherClass);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(teacherClass, manager.getReference(TeacherClass.class, 1));
	}
	
	@Test
	public void testStudentWithoutClass() {
		
		//Create a school
		School school = new School("School Name", "School Address");
		
		//Create a student
		Student student = new Student("First Name", "Last Name", "Username", "Password", school);
		
		//Persist the student
		manager.getTransaction().begin();
		manager.persist(student);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(student, manager.getReference(Student.class, 1));
	}
	
	@Test
	public void testStudentWithClass() {
		
		//Create a school
		School school = new School("School Name", "School Address");
		
		//Create a student
		Student student = new Student("First Name", "Last Name", "Username", "Password", school);
		
		//Create a class
		TeacherClass teacherClass = new TeacherClass(new Teacher(), "Class Name", 4, school, 2017, 2018);
		
		//Setup the relationship
		student.getTeacherClasses().add(teacherClass);
		teacherClass.getStudents().add(student);
		
		//Persist the student
		manager.getTransaction().begin();
		manager.persist(student);
		manager.getTransaction().commit();
		
		//Test
		assertEquals(student, manager.getReference(Student.class, 1));
	}

}
