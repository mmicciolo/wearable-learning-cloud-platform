package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Teacher Class
 *
 */
@Entity
@Table(name = "TEACHER_CLASS")
public class TeacherClass implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "TEACHER_CLASS_ID")
	private int teacherClassId;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "TEACHER_ID")
	private Teacher teacher;
	
	@Column(length = 40, name = "TEACHER_CLASS_NAME")
	private String teacherClassName;
	
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
	
	public TeacherClass(Teacher teacher, String teacherClassName, int grade, String schoolName, int schoolYearStart,
			int schoolYearEnd) {
		super();
		this.teacher = teacher;
		this.teacherClassName = teacherClassName;
		this.grade = grade;
		this.schoolName = schoolName;
		this.schoolYearStart = schoolYearStart;
		this.schoolYearEnd = schoolYearEnd;
	}
	
	public TeacherClass() {
		super();
	}

	public int getTeacherClassId() {
		return teacherClassId;
	}

	public void setTeacherClassId(int teacherClassId) {
		this.teacherClassId = teacherClassId;
	}

	public Teacher getTeacher() {
		return teacher;
	}

	public void setTeacher(Teacher teacher) {
		this.teacher = teacher;
	}

	public String getTeacherClassName() {
		return teacherClassName;
	}

	public void setTeacherClassName(String teacherClassName) {
		this.teacherClassName = teacherClassName;
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
