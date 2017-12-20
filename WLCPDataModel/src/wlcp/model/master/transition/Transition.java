package wlcp.model.master.transition;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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
	
	@JoinTable(name = "TRANSITION_SINGLE_PRESS", joinColumns = @JoinColumn(name = "TRANSITION_ID", referencedColumnName = "TRANSITION_ID"), inverseJoinColumns = @JoinColumn(name = "SINGLE_BUTTON_PRESS_ID", referencedColumnName = "SINGLE_BUTTON_PRESS_ID"))
	@OneToMany(orphanRemoval = true)
	private List<SingleButtonPress> singleButtonPresses = new ArrayList<SingleButtonPress>();

	public Transition() {
		super();
	}
	
	public Transition(String transitionId, Game game, String connection, List<SingleButtonPress> singleButtonPresses) {
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

	public List<SingleButtonPress> getSingleButtonPresses() {
		return singleButtonPresses;
	}

	public void setSingleButtonPresses(List<SingleButtonPress> singleButtonPresses) {
		this.singleButtonPresses = singleButtonPresses;
	}
   
}
