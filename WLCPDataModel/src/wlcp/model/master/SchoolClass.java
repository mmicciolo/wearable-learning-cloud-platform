package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Class
 *
 */
@Entity
@Table(name = "SCHOOL_CLASS")
public class SchoolClass implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "SCHOOL_CLASS_ID")
	private int schoolClassId;
	
	@ManyToOne
	@JoinColumn(name = "TEACHER_ID")
	private Teacher teacher;
	
	@Column(length = 40, name = "SCHOOL_CLASS_NAME")
	private String schoolClassName;
	
	@Column(name = "GRADE")
	private int grade;
	
	@Column(length = 40, name = "SCHOOL_NAME")
	private String schoolName;
	
	@Column(name = "SCHOOL_YEAR_START")
	private int schoolYearStart;
	
	@Column(name = "SCHOOL_YEAR_END")
	private int schoolYearEnd;
	
//	@ManyToMany
//	@JoinTable(name = "CLASS_STUDENTS", joinColumns = @JoinColumn(name = "CLASSES", referencedColumnName = "SCHOOL_CLASS_ID"),
//	inverseJoinColumns = @JoinColumn(name = "STUDENTS", referencedColumnName = "STUDENT_ID"))
//	private List<Student> students = new ArrayList<Student>();

	public SchoolClass(String schoolClassName, int grade, String schoolName, int schoolYearStart,
			int schoolYearEnd) {
		super();
		this.schoolClassName = schoolClassName;
		this.grade = grade;
		this.schoolName = schoolName;
		this.schoolYearStart = schoolYearStart;
		this.schoolYearEnd = schoolYearEnd;
	}

	public SchoolClass() {
		super();
	}

	public int getSchoolClassId() {
		return schoolClassId;
	}

	public void setSchoolClassId(int schoolClassId) {
		this.schoolClassId = schoolClassId;
	}

	public String getSchoolClassName() {
		return schoolClassName;
	}

	public void setSchoolClassName(String schoolClassName) {
		this.schoolClassName = schoolClassName;
	}

	public int getGrade() {
		return grade;
	}

	public void setGrade(int grade) {
		this.grade = grade;
	}

	public String getSchoolName() {
		return schoolName;
	}

	public void setSchoolName(String schoolName) {
		this.schoolName = schoolName;
	}

	public int getSchoolYearStart() {
		return schoolYearStart;
	}

	public void setSchoolYearStart(int schoolYearStart) {
		this.schoolYearStart = schoolYearStart;
	}

	public int getSchoolYearEnd() {
		return schoolYearEnd;
	}

	public void setSchoolYearEnd(int schoolYearEnd) {
		this.schoolYearEnd = schoolYearEnd;
	}
   
}
