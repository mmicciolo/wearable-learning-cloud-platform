package wlcp.testdata.entities;

import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVRecord;

import wlcp.model.master.School;
import wlcp.model.master.Teacher;
import wlcp.model.master.TeacherClass;
import wlcp.testdata.loader.DataLoaderEntity;
import wlcp.testdata.loader.GetterSetter;

public class TeacherClassEntity extends DataLoaderEntity<TeacherClass>  {

	public TeacherClassEntity(String fileName) {
		super(fileName, TeacherClass.class);
		columnSetterMap.put("TEACHER_CLASS_NAME", new GetterSetter("setTeacherClassName", String.class));
		columnSetterMap.put("GRADE", new GetterSetter("setGrade", Integer.class));
		columnSetterMap.put("SCHOOL_YEAR_START", new GetterSetter("setSchoolYearStart", Integer.class));
		columnSetterMap.put("SCHOOL_YEAR_END", new GetterSetter("setSchoolYearEnd", Integer.class));
		columnGetterMap.put("IDGetter", new GetterSetter("getTeacherClassId", Integer.class));
	}
	
	@Override
	public List<TeacherClass> ReadData(EntityManager entityManager) {
		List<TeacherClass> teacherClasses = super.ReadData();
		LoadCSVRecords();
		for(CSVRecord record : csvRecords) {
			teacherClasses.get((int)record.getRecordNumber() - 1).setTeacher(entityManager.getReference(Teacher.class, Integer.parseInt(record.get("TEACHER_ID"))));
			teacherClasses.get((int)record.getRecordNumber() - 1).setSchool(entityManager.getReference(School.class, Integer.parseInt(record.get("SCHOOL_ID"))));
		}
		return teacherClasses;
	}

}
