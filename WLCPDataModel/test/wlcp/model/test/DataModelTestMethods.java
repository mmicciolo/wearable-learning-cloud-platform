package wlcp.model.test;

import java.util.ArrayList;

import wlcp.model.master.*;

public class DataModelTestMethods {
	
	public static Teacher CreateTeacher() {
		
		//Create a teacher object and populate it
		Teacher teacher = new Teacher("First Name", "Last Name", "Email@Email.com", new ArrayList<SchoolClass>());
		
		return teacher;
	}
	
	public static SchoolClass CreateSchoolClass() {
		
		//Create a class object and populate it
		SchoolClass schoolClass = new SchoolClass("School Class Name", 5, "School Name", 2017, 2018);
		
		return schoolClass;
	}

}
