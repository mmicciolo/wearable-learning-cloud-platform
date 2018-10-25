package wlcp.frontend.test;

import static org.junit.Assert.assertThat;

import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import static org.hamcrest.Matchers.*;

public class TestPageLoading {
	
	private static WebDriver driver;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		//System.setProperty("webdriver.chrome.driver","C:/Users/Matt/Desktop/chromedriver.exe");
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--headless", "--remote-debugging-port=9222");
	    driver = new ChromeDriver(chromeOptions);
	}

	@Test
	public void test() {
		driver.navigate().to("http://wlcp.embodied.wpi.edu");
		assertThat(driver.getCurrentUrl(), is(equalTo("http://wlcp.embodied.wpi.edu/")));
	}

}
