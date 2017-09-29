package wlcp.testdata.entities;

import java.util.List;

import javax.persistence.EntityManager;

import org.apache.commons.csv.CSVRecord;

import wlcp.model.master.GameLobby;
import wlcp.model.master.Username;
import wlcp.testdata.loader.DataLoaderEntity;
import wlcp.testdata.loader.GetterSetter;

public class GameLobbyEntity extends DataLoaderEntity<GameLobby> {

	public GameLobbyEntity(String fileName) {
		super(fileName, GameLobby.class);
		columnSetterMap.put("GAME_LOBBY_NAME", new GetterSetter("setGameLobbyName", String.class));
		columnGetterMap.put("IDGetter", new GetterSetter("getGameLobbyId", String.class));
	}
	
	@Override
	public List<GameLobby> ReadData(EntityManager entityManager) {
		List<GameLobby> gameLobbies = super.ReadData();
		LoadCSVRecords();
		for(CSVRecord record : csvRecords) {
			gameLobbies.get((int)record.getRecordNumber() - 1).setUsername(entityManager.getReference(Username.class, record.get("USERNAME")));
		}
		return gameLobbies;
	}

}
