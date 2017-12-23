package wlcp.model.master.transition;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.*;

import wlcp.model.master.Game;
import wlcp.model.master.GameLobby;
import wlcp.model.master.connection.Connection;

/**
 * Entity implementation class for Entity: Transition
 *
 */
@Entity
@Table(name = "TRANSITION")
public class Transition implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "TRANSITION_ID")
	private String transitionId;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "GAME")
	private Game game;
	
	@Column(name = "CONNECTION")
	private String connection;
	
	@ElementCollection()
    @CollectionTable(name = "SINGLE_BUTTON_PRESS")
    @MapKeyColumn(name = "SCOPE")
	private Map<String, SingleButtonPress> singleButtonPresses = new HashMap<String, SingleButtonPress>();

	public Transition() {
		super();
	}
	
	public Transition(String transitionId, Game game, String connection,
			Map<String, SingleButtonPress> singleButtonPresses) {
		super();
		this.transitionId = transitionId;
		this.game = game;
		this.connection = connection;
		this.singleButtonPresses = singleButtonPresses;
	}

	public String getTransitionId() {
		return transitionId;
	}

	public void setTransitionId(String transitionId) {
		this.transitionId = transitionId;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public String getConnection() {
		return connection;
	}

	public void setConnection(String connection) {
		this.connection = connection;
	}

	public Map<String, SingleButtonPress> getSingleButtonPresses() {
		return singleButtonPresses;
	}

	public void setSingleButtonPresses(Map<String, SingleButtonPress> singleButtonPresses) {
		this.singleButtonPresses = singleButtonPresses;
	}

}
