package wlcp.model.master.connection;

import java.io.Serializable;

import javax.persistence.*;

import wlcp.model.master.Game;
import wlcp.model.master.state.State;
import wlcp.model.master.transition.Transition;

/**
 * Entity implementation class for Entity: Connection
 *
 */
@Entity
@Table(name = "CONNECTION")
public class Connection implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "CONNECTION_ID")
	private String connectionId;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "GAME")
	private Game game;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "CONNECTION_FROM")
	private State connectionFrom;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "CONNECTION_TO")
	private State connectionTo;
	
	@Column(name = "BACKWARDS_LOOP")
	private Boolean backwardsLoop;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "TRANSITION")
	private Transition transition;

	public Connection() {
		super();
	}

	public Connection(String connectionId, Game game, State connectionFrom, State connectionTo, Boolean backwardsLoop,
		   Transition transition) {
		super();
		this.connectionId = connectionId;
		this.game = game;
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
		this.backwardsLoop = backwardsLoop;;
		this.transition = transition;
	}

	public String getConnectionId() {
		return connectionId;
	}

	public void setConnectionId(String connectionId) {
		this.connectionId = connectionId;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public State getConnectionFrom() {
		return connectionFrom;
	}

	public void setConnectionFrom(State connectionFrom) {
		this.connectionFrom = connectionFrom;
	}

	public State getConnectionTo() {
		return connectionTo;
	}

	public void setConnectionTo(State connectionTo) {
		this.connectionTo = connectionTo;
	}

	public Boolean getBackwardsLoop() {
		return backwardsLoop;
	}

	public void setBackwardsLoop(Boolean backwardsLoop) {
		this.backwardsLoop = backwardsLoop;
	}

	public Transition getTransition() {
		return transition;
	}

	public void setTransition(Transition transition) {
		this.transition = transition;
	}
	
}
