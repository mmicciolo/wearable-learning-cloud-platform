package wlcp.model.log;

import java.io.Serializable;
import javax.persistence.*;

import wlcp.model.master.Game;

/**
 * Entity implementation class for Entity: EditorLog
 *
 */
@Entity
@Table(name = "EDITOR_LOG")
public class EditorLog implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(length = 40, name = "GAME_ID")
	private String gameId;
	
	@Column(name = "LOG_COUNT")
	private Integer logCount;
	

	public EditorLog() {
		super();
	}

	public EditorLog(String gameId, Integer logCount) {
		super();
		this.gameId = gameId;
		this.logCount = logCount;
	}

	public String getGameId() {
		return gameId;
	}

	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public Integer getLogCount() {
		return logCount;
	}

	public void setLogCount(Integer logCount) {
		this.logCount = logCount;
	}
	
}
