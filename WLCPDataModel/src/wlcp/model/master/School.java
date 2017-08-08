package wlcp.model.master;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: School
 *
 */
@Entity
@Table(name = "SCHOOL")
public class School implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "SCHOOL_ID")
	private Integer schoolId;
	
	@Column(length = 80, name = "SCHOOL_NAME")
	private String schoolName;
	
	@Column(length = 80, name = "SCHOOL_ADDRESS")
	private String schoolAddress;

	public School(String schoolName, String schoolAddress) {
		super();
		this.schoolName = schoolName;
		this.schoolAddress = schoolAddress;
	}

	public School() {
		super();
	}

	public Integer getSchoolId() {
		return schoolId;
	}

	public void setSchoolId(Integer schoolId) {
		this.schoolId = schoolId;
	}

	public String getSchoolName() {
		return schoolName;
	}

	public void setSchoolName(String schoolName) {
		this.schoolName = schoolName;
	}

	public String getSchoolAddress() {
		return schoolAddress;
	}

	public void setSchoolAddress(String schoolAddress) {
		this.schoolAddress = schoolAddress;
	}
   
}
