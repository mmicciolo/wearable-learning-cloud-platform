package wlcp.testdata.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVRecord;

import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;
import wlcp.testdata.loader.DataLoaderEntity;

public class UsernameGameLobbyEntity extends DataLoaderEntity<Object> {

	public UsernameGameLobbyEntity(String fileName) {
		super(fileName, null);
	}
	
	@Override
	public List<Object> ReadData(EntityManager entityManager) {
		for(CSVRecord record : csvRecords) {
			Username username = entityManager.getReference(Username.class, record.get("USERNAME"));
			GameLobby gameLobby = entityManager.getReference(GameLobby.class, Integer.parseInt(record.get("GAME_LOBBY_ID")));
			username.getGameLobbies().add(gameLobby);
			entityManager.getTransaction().begin();
			entityManager.persist(username);
			entityManager.getTransaction().commit();
		}
		return new ArrayList<Object>();
	}
}

