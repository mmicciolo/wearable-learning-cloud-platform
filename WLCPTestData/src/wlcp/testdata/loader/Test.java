package wlcp.testdata.loader;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.eclipse.persistence.config.PersistenceUnitProperties;

import wlcp.model.master.Student;
import wlcp.model.master.TeacherClass;
import wlcp.testdata.entities.ClassStudentEntity;
import wlcp.testdata.entities.SchoolEntity;
import wlcp.testdata.entities.StudentEntity;
import wlcp.testdata.entities.TeacherClassEntity;
import wlcp.testdata.entities.TeacherEntity;

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
		
		DataLoaderFactory.LoadData(new SchoolEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\School.csv"), manager);
		DataLoaderFactory.LoadData(new TeacherEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\Teacher.csv"), manager);
		DataLoaderFactory.LoadData(new TeacherClassEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\TeacherClass.csv"), manager);
		DataLoaderFactory.LoadData(new StudentEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\Student.csv"), manager);
		DataLoaderFactory.LoadData(new ClassStudentEntity("C:\\Users\\Matt\\git\\wearable-learning-cloud-platform\\WLCPTestData\\TestData\\ClassStudent.csv"), manager);

		TeacherClass teacherClass = manager.getReference(TeacherClass.class, 1);
		Student student = manager.getReference(Student.class, 1);
		int i = 0;
		
		manager.close();
		factory.close();
	}

}
