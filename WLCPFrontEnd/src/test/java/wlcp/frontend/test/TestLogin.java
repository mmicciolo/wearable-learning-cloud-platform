package wlcp.frontend.test;

import java.io.File;
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
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

import wlcp.frontend.test.helpers.EmbeddedTomcat;
import wlcp.model.master.Username;

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
	    SetupJPA();
	    SetupUsername();
	}
	
	@AfterClass
	public static void tearDownAfterClass() {
		try {
			tomcat.Stop();
			driver.close();
		} catch (Exception e) {
			
		}
	}
	
	private static void SetupJPA() {
		File[] files = new File(System.getProperty("java.io.tmpdir") + "WLCPWebApp/WEB-INF/lib/").listFiles();
		for(File f : files) {
			if(f.getPath().contains(".jar.bak")) {
				f.renameTo(new File(f.getPath().replaceAll(".bak", "")));
			}
		}
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
	}
	
	private static void SetupUsername() {
		Username username = new Username("test", "password", "firstname", "lastname", "email");
		manager.getTransaction().begin();
		manager.persist(username);
		manager.getTransaction().commit();
	}

	@Test
	public void basicLoginPositive() throws InterruptedException {
		 driver.navigate().to("http://127.0.0.1:" + tomcat.getPort() + "/WLCPFrontEnd");
		driver.findElement(By.id("idView1--uid-inner")).sendKeys("test");
		driver.findElement(By.id("idView1--pasw-inner")).sendKeys("password");
		driver.findElement(By.id("__box0-inner")).sendKeys("Game Editor");
		driver.findElement(By.id("__box0-inner")).sendKeys(Keys.ENTER);
		driver.findElement(By.id("__button0")).sendKeys(Keys.ENTER);
		Thread.sleep(5000);
		assertThat(driver.findElement(By.id("gameEditor")), is(not(equalTo(null))));
	}
	
	@Test(expected = NoSuchElementException.class)
	public void basicLoginNegative() throws InterruptedException {
		driver.navigate().to("http://127.0.0.1:" + tomcat.getPort() + "/WLCPFrontEnd");
		driver.findElement(By.id("idView1--uid-inner")).sendKeys("test");
		driver.findElement(By.id("idView1--pasw-inner")).sendKeys("password");
		driver.findElement(By.id("__box0-inner")).sendKeys("Game Manager");
		driver.findElement(By.id("__box0-inner")).sendKeys(Keys.ENTER);
		driver.findElement(By.id("__button0")).sendKeys(Keys.ENTER);
		Thread.sleep(5000);
		driver.findElement(By.id("gameEditor"));
	}

}
