package wlcp.testdata.entities;

import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVRecord;

import wlcp.model.master.School;
import wlcp.model.master.Teacher;
import wlcp.testdata.loader.DataLoaderEntity;
import wlcp.testdata.loader.GetterSetter;

public class TeacherEntity extends DataLoaderEntity<Teacher> {

	public TeacherEntity(String fileName) {
		super(fileName, Teacher.class);
		columnSetterMap.put("FIRST_NAME", new GetterSetter("setFirstName", String.class));
		columnSetterMap.put("LAST_NAME", new GetterSetter("setLastName", String.class));
		columnSetterMap.put("EMAIL_ADDRESS", new GetterSetter("setEmailAddress", String.class));
		columnSetterMap.put("PASSWORD", new GetterSetter("setPassword", String.class));
		columnGetterMap.put("IDGetter", new GetterSetter("getTeacherId", Integer.class));
	}
	
	@Override
	public List<Teacher> ReadData(EntityManager entityManager) {
		List<Teacher> teachers = super.ReadData();
		LoadCSVRecords();
		for(CSVRecord record : csvRecords) {
			School school = entityManager.getReference(School.class, Integer.parseInt(record.get("SCHOOL_ID")));
			teachers.get((int)record.getRecordNumber() - 1).setSchool(school);
		}
		return teachers;
	}

}
