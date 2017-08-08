package wlcp.testdata.loader;

/**
 * This class holds another classes property getter and setter method name and 
 * what parameter type it takes.
 * 
 * @author Matt
 *
 */
public class GetterSetter {
	
	/**
	 * The method name of the getter or setter
	 */
	private String methodName;
	
	/**
	 * The parameters type (String, int, etc)
	 */
	private Class<?> parameterType;
	
	/**
	 * Default constructor is not allowed
	 */
	@SuppressWarnings("unused")
	private GetterSetter() { }
	
	/**
	 * Every class must be instantiate with a method name and the parameter type
	 * 
	 * @param methodName
	 * @param parameterType
	 */
	public GetterSetter(String methodName, Class<?> parameterType) {
		this.methodName = methodName;
		this.parameterType = parameterType;
	}
	
	/**
	 * Get the method name as a string for reflection
	 * 
	 * @return method name as a string
	 */
	public String getMethodName() {
		return methodName;
	}
	
	/**
	 * Get the parameter type as a java class
	 * 
	 * @return parameter type as a java class
	 */
	public Class<?> getParameterType() {
		return parameterType;
	}

}
