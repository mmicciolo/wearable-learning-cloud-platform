package wlcp.testdata.loader;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;

/**
 * This factory provides a way to interface with data loader entities.
 * More specifically it allows reading of data (return it in a list) as 
 * well as the loading of data (puts it into the database)
 * 
 * @author Matt
 *
 */
public class DataLoaderFactory {
	
	/**
	 * Read the data and return it into a list. Do not place into the database
	 * @param dataLoaderEntity - Entity whose data needs to be loaded
	 * @param entityManager - Persistence Entity Manager that can be used in the overridden ReadData().
	 * @return List of the entities loaded
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> ReadData(DataLoaderEntity<?> dataLoaderEntity, EntityManager entityManager) {
		return (List<T>)dataLoaderEntity.ReadData(entityManager);
	}
	
	/**
	 * This method calls the read function and then places the data into the database
	 * @param dataLoaderEntity - Entity whose data needs to be loaded into the database
	 * @param entityManager - JPA Entity Manager
	 */
	public static boolean LoadData(DataLoaderEntity<?> dataLoaderEntity, EntityManager entityManager) {
		//Check to see if data is already loaded
		if(dataLoaderEntity.getEntityList().size() == 0) {
			ReadData(dataLoaderEntity, entityManager);
		}
		//Check if we have a valid entity manager
		if(entityManager != null) {
			try {
				//Get the method to get the entites id
				Method method = dataLoaderEntity.getEntityList().get(0).getClass().getMethod(dataLoaderEntity.columnGetterMap.get("IDGetter").getMethodName());
				//Loop through the entities
				for(Object entity : dataLoaderEntity.getEntityList()) {
					//Try to see if it exists
					try {
						//If the object exists we wont hit the catch
						if(method.invoke(entity) != null) {
							entityManager.getReference(entity.getClass(), method.invoke(entity));
						} else {
							entityManager.getTransaction().begin();
							entityManager.persist(entity);
							entityManager.getTransaction().commit();
						}
					} catch (EntityNotFoundException e) {
						//The object doesnt't exist
						entityManager.getTransaction().begin();
						entityManager.persist(entity);
						entityManager.getTransaction().commit();
					} catch (IllegalAccessException e) {
						//If we get here, we are illegally trying to access the method i.e. its private or protected
						e.printStackTrace();
						System.out.println("Could not access method " + method.getName() + ", is it public?");
						return false;
					} catch (IllegalArgumentException e) {
						//If we get here we gave the method the wrong args
						e.printStackTrace();
						System.out.println("The method " + method.getName() + "does not take the args you provided.");
						return false;
					} catch (InvocationTargetException e) {
						//If we get here there was an issue invoking the method
						e.printStackTrace();
						System.out.println("Could not invoke the method " + method.getName());
						return false;
					}
				}
			} catch (NoSuchMethodException e1) {
				//If we get here, the method provided does not exists
				e1.printStackTrace();
				System.out.println("The method " + dataLoaderEntity.columnGetterMap.get("IDGetter").getMethodName() + " does not exist. Check your spelling.");
				return false;
			} catch (SecurityException e1) {
				//If we get here there was a security violation
				e1.printStackTrace();
				System.out.println("Security Violation on method " + dataLoaderEntity.columnGetterMap.get("IDGetter").getMethodName());
				return false;
			}  catch (NullPointerException e) {
				e.printStackTrace();
				System.out.println("The IDGetter key does not exist in the columnGetterMap. Please check your data class.");
				return false;
			}
		}
		return true;
	}
}
