package wlcp.webapp.spring.config;

import java.util.Properties;

import javax.naming.NamingException;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jndi.JndiTemplate;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@EnableJpaRepositories("")
public class PersistenceJPAConfig {
	
   @Bean
   public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
	   
	   //Create the vendor adapter (in this case use eclipselink)
	   EclipseLinkJpaVendorAdapter vendorAdapter = new EclipseLinkJpaVendorAdapter();
	   
	   //Create the entity manager factory
	   LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
       em.setDataSource(dataSource);
       em.setJpaVendorAdapter(vendorAdapter);
       em.setJpaProperties(additionalProperties());
       em.setPersistenceUnitName("WLCPDataModel");

       //Return the newly created instance
       return em;
   }
   
   @Bean
   public DataSource dataSource() {
//	   MysqlDataSource dataSource = new MysqlDataSource();
//	   dataSource.setUrl("jdbc:mysql://localhost/wlcp");
//	   dataSource.setUser("wlcp");
//	   dataSource.setPassword("wlcp");
//	   return dataSource;
	   DataSource dataSource = null;
       JndiTemplate jndi = new JndiTemplate();
       try {
           dataSource = jndi.lookup("java:comp/env/jdbc/DefaultDB", DataSource.class);
       } catch (NamingException e) {
           e.printStackTrace();
       }
       return dataSource;
   }
   
   @Bean
   public PlatformTransactionManager transactionManager(EntityManagerFactory emf){
	   //Setup the transaction manager for the entity manager
       JpaTransactionManager transactionManager = new JpaTransactionManager();
       transactionManager.setEntityManagerFactory(emf);
 
       return transactionManager;
   }
   
   Properties additionalProperties() {
	   //When using eclipse link disable weaving
       Properties properties = new Properties();
       properties.setProperty("eclipselink.weaving", "false");
       return properties;
   }

}
