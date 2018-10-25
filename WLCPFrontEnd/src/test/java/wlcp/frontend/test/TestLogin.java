package wlcp.frontend.test;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import wlcp.frontend.test.helpers.EmbeddedTomcat;

public class TestLogin {

	private static WebDriver driver;
	private static EmbeddedTomcat tomcat;
	
	private static EntityManagerFactory factory;
	private static EntityManager manager;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--headless", "--remote-debugging-port=9222");
	    driver = new ChromeDriver(chromeOptions);
	    tomcat = new EmbeddedTomcat();
	    tomcat.Start();
	    System.out.println(tomcat.getPort());
	    driver.navigate().to("http://127.0.0.1:" + tomcat.getPort() + "/WLCPFrontEnd");
	}
	
	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		tomcat.Stop();
	}
	
	private static void SetupJPA() {
		// Setup an embedded db connection
		Map<String, String> TEST_CONFIG_LOCALHOST = new HashMap<String, String>();
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_URL, "jdbc:derby:memory:DefaultDB;create=true");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.JDBC_DRIVER, "org.apache.derby.jdbc.EmbeddedDriver");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.DDL_GENERATION, PersistenceUnitProperties.DROP_AND_CREATE);
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.TARGET_DATABASE, "Derby");
		TEST_CONFIG_LOCALHOST.put(PersistenceUnitProperties.LOGGING_LEVEL, "OFF");

		// Create a new factory using the JPA PEPDataModel
		factory = Persistence.createEntityManagerFactory("WLCPDataModel", TEST_CONFIG_LOCALHOST);

		// Create a new entity manager
		manager = factory.createEntityManager();
		
//		Username username = new Username("test", "password", "firstname", "lastname", "email");
//		manager.getTransaction().begin();
//		manager.persist(username);
//		manager.getTransaction().commit();
	}

	@Test
	public void basicLogin() throws InterruptedException {
		driver.findElement(By.id("idView1--uid-inner")).sendKeys("test");
		driver.findElement(By.id("idView1--pasw-inner")).sendKeys("test");
		driver.findElement(By.id("__box0-inner")).sendKeys("Game Manager");
		driver.findElement(By.id("__box0-inner")).sendKeys(Keys.RETURN);
		//Thread.sleep(1000);
		//driver.findElement(By.id("__button0")).click();
	}

}
