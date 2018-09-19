package wlcp.testdata.loader;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

/**
 * This is a base abstract class that different data entities can inherit from.
 * It provides methods to read data from a CSV and put it in a new class instance
 * of the given type and setter function.
 * 
 * @author Matt
 * @param <T> Data Model Entity Type
 */

public abstract class DataLoaderEntity<T> {
	
	/**
	 * Filename for the CSV Reader
	 */
	private String fileName = null;
	
	/**
	 * CSV Reader - Used to pull data from a given CSV file
	 */
	private Reader csvReader = null;
	
	/**
	 * Records pulled from the CSV files via the CSV Reader
	 */
	protected Iterable<CSVRecord> csvRecords = null;
	
	/**
	 * List of entities in their actual class type pulled from the CSV Records
	 */
	private List<T> entityList = new ArrayList<T>();
	
	/**
	 * Map of CSV Column Name VS a Class Setter (Setter Function Name vs Parameter Type)
	 */
	protected Map<String, GetterSetter> columnSetterMap = new HashMap<String, GetterSetter>();
	
	/**
	 * Map of ID Getter name
	 */
	protected Map<String, GetterSetter> columnGetterMap = new HashMap<String, GetterSetter>();
	
	/**
	 * Class type of the entity we will be instantiating when creating them for insertion
	 * into a database.
	 */
	private Class<T> entityClass;
	
	/**
	 * Constructor requires the CSV filename and the class type of the entity
	 * 
	 * @param fileName - CSV filename
	 * @param entityClass - Class Type of the data you will be loading
	 */
	public DataLoaderEntity(String fileName, Class<T> entityClass) {
		
		//Set the filename
		this.fileName = fileName;
		
		//Set the entity class
		this.entityClass = entityClass;
		
		//Load the data
		LoadCSVRecords();
	}
	
	/** 
	 * Loads the CSV Records based off of the filename
	 * @param fileName - CSV filename
	 */
	protected void LoadCSVRecords() {
		try {
			
			//Create a CSV reader based off of the given filename
			csvReader = new FileReader(fileName);
			
			//Pull out of the CSV records with headers
			csvRecords = CSVFormat.EXCEL.withFirstRecordAsHeader().parse(csvReader);
		} catch (IOException e) {
			//If we get here there was a problem reading
			e.printStackTrace();
		}
	}
	
	/**
	 * This method can be overridden to provide a more complex version of ReadData().
	 * For example, you may be reading in ID's that reference other entites that have already
	 * been loaded into the database.
	 * @param entityManager - Entity Manager For Persistence (used for getting references to other entities)
	 * @return List of entites read from the CSV in their appropriate class type.
	 */
	public List<T> ReadData(EntityManager entityManager) {
		return ReadData();
	}
	
	/**
	 * This method loops through all of the CSV records, creates a new instance of the given class type
	 * and calls the appropriate setter based off of the columnFunctionMap and fills it with the CSV data.
	 * 
	 * @return List of entities read from the CSV in their appropriate class type.
	 */
	public List<T> ReadData() {
		//Loop through all of the read CSV Records
		for(CSVRecord record : csvRecords) {
			try {
				//Create a new instance of the entity type via reflection
				T t = entityClass.newInstance();
				
				//Loop through all of the keys in the Column Function Map
				for(String key : columnSetterMap.keySet()) {
					
					//Find the appropriate method based off of the name and parameter type
					Method method = t.getClass().getMethod(columnSetterMap.get(key).getMethodName(), columnSetterMap.get(key).getParameterType());
					
					//If the record is string, no need to cast
					if(columnSetterMap.get(key).getParameterType().equals(String.class)) {
						
						//Call the method
						method.invoke(t, checkString(record.get(key)));
					} else if(columnSetterMap.get(key).getParameterType().equals(Integer.class)) {
						
						//Call the method
						method.invoke(t, checkInt(record.get(key)));
					} else if(columnSetterMap.get(key).getParameterType().equals(Float.class)) {
						
						//Call the method
						method.invoke(t, checkFloat(record.get(key)));
					} else if(columnSetterMap.get(key).getParameterType().equals(Date.class)) {
						
						//Check if its a date or time
						if(record.get(key).contains("/")) {
							
							//Call its a date
							method.invoke(t, checkDate(record.get(key)));
						} else if(record.get(key).contains(":")) {
							
							//Its a time
							method.invoke(t, checkTime(record.get(key)));
						}
						
					}
				}
				
				//If everything went well, add the entity
				entityList.add(t);
			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				e.printStackTrace();
			} catch (SecurityException e) {
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
		}
		return entityList;
	}
	
	/**
	 * This method will change any empty string ("") to NULL.
	 * JPA does not allow the insertion of "" strings only NULL for empty ones.
	 * 
	 * @param string - Non null string ("")
	 * @return string - Fixed string
	 */
	public String checkString(String string) {
		if(string.equals("")) {
			return null;
		} else {
			return string;
		}
	}
	
	/**
	 * This method checks to see if the string is null and if not parses it
	 * and returns an Int
	 * @param string
	 * @return Int from string
	 */
	public Integer checkInt(String string) {
		if(checkString(string) != null) {
			return Integer.parseInt(string);
		}
		return null;
	}
	
	/**
	 * This method checks to see if the string is null and if not parses it
	 * and returns a Float
	 * @param string
	 * @return Float from string
	 */
	public Float checkFloat(String string) {
		if(checkString(string) != null) {
			return Float.parseFloat(string);
		}
		return null;
	}
	
	/**
	 * This method checks to see if the string is null and if not parses it
	 * and returns a Date
	 * @param string
	 * @return Date from string
	 */
	public Date checkDate(String string) {
		if(checkString(string) != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("mm/dd/yyyy");
			try {
				return sdf.parse(string);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return null;
	}
	
	/**
	 * This method checks to see if the string is null and if not parses it
	 * and returns a Time
	 * @param string
	 * @return Time from string
	 */
	public Date checkTime(String string) {
		if(checkString(string) != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("hh:mm:ss");
			try {
				return sdf.parse(string);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		return null;
	}
	
	/**
	 * Returns the entity list
	 * @return entity list
	 */
	public List<T> getEntityList() {
		return entityList;
	}
	
}
