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
	
	@Column(length = 40, name = "CONNECTION_FROM")
	private String connectionFrom;
	
	@Column(length = 40, name = "CONNECTION_TO")
	private String connectionTo;
	
	@Column(name = "BACKWARDS_LOOP")
	private Boolean backwardsLoop;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "CONNECTION_FROM_STATE")
	private State connectionFromState;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "CONNECTION_TO_STATE")
	private State connectionToState;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "TRANSITION")
	private Transition transition;

	public Connection() {
		super();
	}

//	public Connection(String connectionId, Game game, String connectionFrom, String connectionTo, Boolean backwardsLoop) {
//		super();
//		this.connectionId = connectionId;
//		this.game = game;
//		this.connectionFrom = connectionFrom;
//		this.connectionTo = connectionTo;
//		this.backwardsLoop = backwardsLoop;
//	}
	
	public Connection(String connectionId, Game game, String connectionFrom, String connectionTo, Boolean backwardsLoop,
			State connectionFromState, State connectionToState, Transition transition) {
		super();
		this.connectionId = connectionId;
		this.game = game;
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
		this.backwardsLoop = backwardsLoop;
		this.connectionFromState = connectionFromState;
		this.connectionToState = connectionToState;
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

	public String getConnectionFrom() {
		return connectionFrom;
	}

	public void setConnectionFrom(String connectionFrom) {
		this.connectionFrom = connectionFrom;
	}

	public String getConnectionTo() {
		return connectionTo;
	}

	public void setConnectionTo(String connectionTo) {
		this.connectionTo = connectionTo;
	}

	public Boolean getBackwardsLoop() {
		return backwardsLoop;
	}

	public void setBackwardsLoop(Boolean backwardsLoop) {
		this.backwardsLoop = backwardsLoop;
	}

	public State getConnectionFromState() {
		return connectionFromState;
	}

	public void setConnectionFromState(State connectionFromState) {
		this.connectionFromState = connectionFromState;
	}

	public State getConnectionToState() {
		return connectionToState;
	}

	public void setConnectionToState(State connectionToState) {
		this.connectionToState = connectionToState;
	}

	public Transition getTransition() {
		return transition;
	}

	public void setTransition(Transition transition) {
		this.transition = transition;
	}
	
}
