package wlcp.testdata.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVRecord;

import wlcp.model.master.School;
import wlcp.model.master.Student;
import wlcp.model.master.TeacherClass;
import wlcp.testdata.loader.DataLoaderEntity;

public class ClassStudentEntity extends DataLoaderEntity<Object> {

	public ClassStudentEntity(String fileName) {
		super(fileName, null);
	}
	
	@Override
	public List<Object> ReadData(EntityManager entityManager) {
		for(CSVRecord record : csvRecords) {
			Student student = entityManager.getReference(Student.class, Integer.parseInt(record.get("STUDENT_ID")));
			TeacherClass teacherClass = entityManager.getReference(TeacherClass.class, Integer.parseInt(record.get("TEACHER_CLASS_ID")));
			teacherClass.getStudents().add(student);
			student.getTeacherClasses().add(teacherClass);
			entityManager.getTransaction().begin();
			entityManager.persist(teacherClass);
			entityManager.persist(student);
			entityManager.getTransaction().commit();
		}
		return new ArrayList<Object>();
	}
}
