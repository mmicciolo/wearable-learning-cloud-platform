package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Teacher
 *
 */
@Entity
@Table(name = "TEACHER")
public class Teacher implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "TEACHER_ID")
	private int teacherId;
	
	@Column(length = 40, name = "FIRST_NAME")
	private String firstName;
	
	@Column(length = 40, name = "LAST_NAME")
	private String lastName;
	
	@Column(length = 40, name = "EMAIL_ADDRESS")
	private String emailAddress;
	
	@OneToMany(cascade = CascadeType.PERSIST)
	@JoinTable(name = "TEACHER_CLASSES", joinColumns = @JoinColumn(name = "TEACHER_ID", referencedColumnName = "TEACHER_ID"), inverseJoinColumns = @JoinColumn(name = "TEAHCER_CLASS_ID", referencedColumnName = "TEACHER_CLASS_ID"))
	private List<TeacherClass> teacherClasses = new ArrayList<TeacherClass>();

	public Teacher(String firstName, String lastName, String emailAddress) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.emailAddress = emailAddress;
	}
	
	public Teacher() {
		super();
	}

	public int getTeacherId() {
		return teacherId;
	}

	public void setTeacherId(int teacherId) {
		this.teacherId = teacherId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public List<TeacherClass> getTeacherClasses() {
		return teacherClasses;
	}

	public void setTeacherClasses(List<TeacherClass> teacherClasses) {
		this.teacherClasses = teacherClasses;
	}
	
}
