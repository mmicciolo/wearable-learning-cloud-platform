package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.State;
import wlcp.model.master.transition.Transition;

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
	@JsonIgnoreProperties(value= {"password", "firstName", "lastName", "emailAddress", "gameLobbies"})
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
	
	@JoinTable(name = "GAME_STATES", joinColumns = @JoinColumn(name = "GAME_ID", referencedColumnName = "GAME_ID"), inverseJoinColumns = @JoinColumn(name = "STATE_ID", referencedColumnName = "STATE_ID"))
	@OneToMany(orphanRemoval = true)
	private List<State> states = new ArrayList<State>();
	
	@JoinTable(name = "GAME_CONNECTIONS", joinColumns = @JoinColumn(name = "GAME_ID", referencedColumnName = "GAME_ID"), inverseJoinColumns = @JoinColumn(name = "CONNECTION_ID", referencedColumnName = "CONNECTION_ID"))
	@OneToMany(orphanRemoval = true)
	private List<Connection> connections = new ArrayList<Connection>();
	
	@JoinTable(name = "GAME_TRANSITIONS", joinColumns = @JoinColumn(name = "GAME_ID", referencedColumnName = "GAME_ID"), inverseJoinColumns = @JoinColumn(name = "TRANSITION_ID", referencedColumnName = "TRANSITION_ID"))
	@OneToMany(orphanRemoval = true)
	private List<Transition> transitions = new ArrayList<Transition>();

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

	public List<State> getStates() {
		return states;
	}

	public void setStates(List<State> states) {
		this.states = states;
	}

	public List<Connection> getConnections() {
		return connections;
	}

	public void setConnections(List<Connection> connections) {
		this.connections = connections;
	}

	public List<Transition> getTransitions() {
		return transitions;
	}

	public void setTransitions(List<Transition> transitions) {
		this.transitions = transitions;
	}
	
}
