package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Student
 *
 */
//@Entity
@Table(name = "STUDENT")
public class Student implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "STUDENT_ID")
	private int studentId;
	
	@ManyToMany(mappedBy = "students")
	List<SchoolClass> classes = new ArrayList<SchoolClass>();

	public Student() {
		super();
	}
   
}
