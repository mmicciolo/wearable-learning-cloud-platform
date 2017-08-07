package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Student
 *
 */
@Entity
@Table(name = "STUDENT")
public class Student implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "STUDENT_ID")
	private Integer studentId;
	
	@Column(length = 40, name = "USERNAME")
	private String username;
	
	@Column(length = 40, name = "PASSWORD")
	private String password;
	
	@OneToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "SCHOOL", referencedColumnName = "SCHOOL_ID")
	private School school;
	
	@ManyToMany(cascade = CascadeType.PERSIST, mappedBy = "students")
	List<TeacherClass> classes = new ArrayList<TeacherClass>();

	public Student() {
		super();
	}
   
}
