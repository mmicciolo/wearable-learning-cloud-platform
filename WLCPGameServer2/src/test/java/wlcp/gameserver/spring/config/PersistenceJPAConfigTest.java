package wlcp.gameserver.spring.config;

import java.util.Properties;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "wlcp.gameserver.spring.repository")
public class PersistenceJPAConfigTest {
	
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
       EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
       return builder.setType(EmbeddedDatabaseType.DERBY).build();
   }
   
   @Bean
   public JpaTransactionManager transactionManager(EntityManagerFactory emf){
	   //Setup the transaction manager for the entity manager
       JpaTransactionManager transactionManager = new JpaTransactionManager();
       transactionManager.setEntityManagerFactory(emf);
 
       return transactionManager;
   }
   
   Properties additionalProperties() {
	   //When using eclipse link disable weaving
       Properties properties = new Properties();
       properties.setProperty("eclipselink.weaving", "false");
       properties.setProperty("eclipselink.ddl-generation", "drop-and-create-tables");
       return properties;
   }

}
