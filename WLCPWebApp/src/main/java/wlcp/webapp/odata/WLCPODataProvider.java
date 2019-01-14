package wlcp.webapp.odata;

import java.util.HashMap;
import java.util.Map;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.sql.DataSource;

import org.apache.olingo.odata2.jpa.processor.api.ODataJPAContext;
import org.apache.olingo.odata2.jpa.processor.api.ODataJPAServiceFactory;
import org.apache.olingo.odata2.jpa.processor.api.exception.ODataJPARuntimeException;
import org.eclipse.persistence.config.PersistenceUnitProperties;

public class WLCPODataProvider extends ODataJPAServiceFactory {
	
	private ODataJPAContext oDataJPAContext = null;
	private EntityManagerFactory entityManagerFactory = null;
	
	public WLCPODataProvider() {
		
	}
	
	@Override
	public ODataJPAContext initializeODataJPAContext() throws ODataJPARuntimeException {
		
		try {
			
			//Create and intial Context to get our data source
			InitialContext ctx = new InitialContext();
			
			//Get the datasource
			DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/DefaultDB");
			
			//Setup the entity manager factory properties
			Map<Object, Object> properties = new HashMap<Object, Object>();
            properties.put(PersistenceUnitProperties.NON_JTA_DATASOURCE, ds);
    		
    		//Get the current ODataJPAContext
            oDataJPAContext = this.getODataJPAContext();
            
            //Create our factory
            entityManagerFactory = Persistence.createEntityManagerFactory("WLCPDataModel", properties);
            
            //Setup the context based off of our new factory
            oDataJPAContext.setEntityManagerFactory(entityManagerFactory);
			oDataJPAContext.setPersistenceUnitName("WLCPDataModel");
			
			//Add the EDM Extensions
			//oDataJPAContext.setJPAEdmExtension((JPAEdmExtension) new EdmExtensions());
			
			//Return the context
			return oDataJPAContext;
			
		} catch (NamingException e) {
			
			//Something went wrong
			e.printStackTrace();
			
			return null;
		}
	}

}
