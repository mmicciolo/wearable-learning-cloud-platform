package wlcp.gameserver.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import wlcp.gameserver.spring.config.AsyncConfig;
import wlcp.gameserver.spring.config.PersistenceJPAConfigTest;
import wlcp.gameserver.spring.config.WebSocketConfig;

//@SpringBootApplication
@Configuration
@EnableAutoConfiguration
@Import({ PersistenceJPAConfigTest.class, WebSocketConfig.class, AsyncConfig.class })
public class SpringBootWebApplicationTest {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootWebApplicationTest.class, args);
    }
}