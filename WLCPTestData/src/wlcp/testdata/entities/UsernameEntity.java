package wlcp.testdata.entities;

import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVRecord;

import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;
import wlcp.testdata.loader.DataLoaderEntity;
import wlcp.testdata.loader.GetterSetter;

public class UsernameEntity extends DataLoaderEntity<Username> {
	
	public UsernameEntity(String fileName) {
		super(fileName, Username.class);
		columnSetterMap.put("USERNAME", new GetterSetter("setUsername", String.class));
		columnSetterMap.put("PASSWORD", new GetterSetter("setPassword", String.class));
		columnSetterMap.put("FIRST_NAME", new GetterSetter("setFirstName", String.class));
		columnSetterMap.put("LAST_NAME", new GetterSetter("setLastName", String.class));
		columnSetterMap.put("EMAIL_ADDRESS", new GetterSetter("setEmailAddress", String.class));
		columnGetterMap.put("IDGetter", new GetterSetter("getUsername", String.class));
	}

}
