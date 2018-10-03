package wlcp.webapp.spring.config;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import javax.servlet.annotation.WebServlet;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

@WebServlet()
public class SpringWebAppInitializer implements WebApplicationInitializer{
	
	@Override
	public void onStartup(ServletContext container) throws ServletException {
		
        //Create the Spring Application Context and register the config
        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        //rootContext.register(MVCConfig.class);
        rootContext.register(MVCConfig.class, PersistenceJPAConfig.class);
        
        //Add the context as a listener to the servlet
        container.addListener(new ContextLoaderListener(rootContext));
             
        //Register the dispatcher
        ServletRegistration.Dynamic dispatcher = container.addServlet("dispatcher", new DispatcherServlet(rootContext));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/Rest/*");
	}
}
