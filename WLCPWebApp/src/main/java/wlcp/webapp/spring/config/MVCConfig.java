package wlcp.webapp.spring.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebMvc
@ComponentScan(basePackages={"wlcp.webapp.spring.controller"})
public class MVCConfig implements WebMvcConfigurer  {

}
