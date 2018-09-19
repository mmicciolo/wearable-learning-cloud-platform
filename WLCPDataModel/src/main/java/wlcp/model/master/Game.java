package wlcp.model.master;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: Game
 *
 */
@Entity
@Table(name = "GAME")
public class Game implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(length = 40, name = "GAME_ID")
	private String gameId;

	@Column(name = "TEAM_COUNT")
	private Integer teamCount;
	
	@Column(name = "PLAYERS_PER_TEAM")
	private Integer playersPerTeam;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "USERNAME", nullable = false)
	private Username username;
	
	@Column(name = "VISIBILITY")
	private Boolean visibility;
	
	@Column(name = "STATE_ID_COUNT")
	private Integer stateIdCount;
	
	@Column(name = "TRANSITION_ID_COUNT")
	private Integer transitionIdCount;
	
	@Column(name = "CONNECTION_ID_COUNT")
	private Integer connectionIdCount;
	
	@Column(name = "DATA_LOG")
	private Boolean dataLog;

	public Game() {
		super();
	}

	public Game(String gameId, Integer teamCount, Integer playersPerTeam, Username username,
			Boolean visibility, Boolean dataLog) {
		super();
		this.gameId = gameId;
		this.teamCount = teamCount;
		this.playersPerTeam = playersPerTeam;
		this.username = username;
		this.visibility = visibility;
		this.dataLog = dataLog;
	}

	public String getGameId() {
		return gameId;
	}

	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public Integer getTeamCount() {
		return teamCount;
	}

	public void setTeamCount(Integer teamCount) {
		this.teamCount = teamCount;
	}

	public Integer getPlayersPerTeam() {
		return playersPerTeam;
	}

	public void setPlayersPerTeam(Integer playersPerTeam) {
		this.playersPerTeam = playersPerTeam;
	}

	public Username getUsername() {
		return username;
	}

	public void setUsername(Username username) {
		this.username = username;
	}

	public Boolean getVisibility() {
		return visibility;
	}

	public void setVisibility(Boolean visibility) {
		this.visibility = visibility;
	}

	public Integer getStateIdCount() {
		return stateIdCount;
	}

	public void setStateIdCount(Integer stateIdCount) {
		this.stateIdCount = stateIdCount;
	}

	public Integer getTransitionIdCount() {
		return transitionIdCount;
	}

	public void setTransitionIdCount(Integer transitionIdCount) {
		this.transitionIdCount = transitionIdCount;
	}

	public Integer getConnectionIdCount() {
		return connectionIdCount;
	}

	public void setConnectionIdCount(Integer connectionIdCount) {
		this.connectionIdCount = connectionIdCount;
	}

	public Boolean getDataLog() {
		return dataLog;
	}

	public void setDataLog(Boolean dataLog) {
		this.dataLog = dataLog;
	}
	
}
