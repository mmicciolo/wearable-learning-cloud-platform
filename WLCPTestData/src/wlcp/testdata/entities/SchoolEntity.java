package wlcp.testdata.entities;

import wlcp.model.master.School;
import wlcp.testdata.loader.DataLoaderEntity;
import wlcp.testdata.loader.GetterSetter;

public class SchoolEntity extends DataLoaderEntity<School> {

	public SchoolEntity(String fileName) {
		super(fileName, School.class);
		columnSetterMap.put("SCHOOL_NAME", new GetterSetter("setSchoolName", String.class));
		columnSetterMap.put("SCHOOL_ADDRESS", new GetterSetter("setSchoolAddress", String.class));
		columnGetterMap.put("IDGetter", new GetterSetter("getSchoolId", Integer.class));
	}

}
