package wlcp.frontend.test;

import static org.junit.Assert.*;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import wlcp.frontend.test.helpers.EmbeddedTomcat;

import static org.hamcrest.Matchers.*;

public class TestLogin {

	private static WebDriver driver;
	private static EmbeddedTomcat tomcat;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.setProperty("webdriver.chrome.driver","C:/Users/Matt/Desktop/chromedriver.exe");
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--headless", "--remote-debugging-port=9222");
	    driver = new ChromeDriver(chromeOptions);
	    tomcat = new EmbeddedTomcat();
	    tomcat.Start();
	    driver.navigate().to("http://127.0.0.1:" + tomcat.getPort() + "/WLCPFrontEnd");
	}
	
	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		tomcat.Stop();
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
