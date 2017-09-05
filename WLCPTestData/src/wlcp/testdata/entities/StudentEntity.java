package wlcp.testdata.entities;

import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVRecord;

import wlcp.model.master.School;
import wlcp.model.master.Student;
import wlcp.testdata.loader.DataLoaderEntity;
import wlcp.testdata.loader.GetterSetter;

public class StudentEntity extends DataLoaderEntity<Student> {

	public StudentEntity(String fileName) {
		super(fileName, Student.class);
		columnSetterMap.put("FIRSTNAME", new GetterSetter("setFirstName", String.class));
		columnSetterMap.put("LASTNAME", new GetterSetter("setLastName", String.class));
		columnSetterMap.put("USERNAME", new GetterSetter("setUsername", String.class));
		columnSetterMap.put("PASSWORD", new GetterSetter("setPassword", String.class));
		columnGetterMap.put("IDGetter", new GetterSetter("getStudentId", Integer.class));
	}
	
	@Override
	public List<Student> ReadData(EntityManager entityManager) {
		List<Student> students = super.ReadData();
		LoadCSVRecords();
		for(CSVRecord record : csvRecords) {
			students.get((int)record.getRecordNumber() - 1).setSchool(entityManager.getReference(School.class, Integer.parseInt(record.get("SCHOOL_ID"))));
		}
		return students;
	}

}
