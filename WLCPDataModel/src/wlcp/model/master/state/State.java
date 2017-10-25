package wlcp.model.master.state;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;

/**
 * Entity implementation class for Entity: State
 *
 */
@Entity
@Table(name = "STATE")
@Inheritance(strategy = InheritanceType.JOINED)
public class State implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "STATE_ID")
	private Integer stateId;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "GAME")
	private Game game;
	
	@Column(length = 40, name = "GAME_STATE_ID")
	private String gameStateId;
	
	@Column(name = "POSITION_X")
	private Float positionX;
	
	@Column(name = "POSITION_Y")
	private Float positionY;
	
	@JoinTable(name = "STATE_INPUT_CONNECTIONS", joinColumns = @JoinColumn(name = "STATE_ID", referencedColumnName = "STATE_ID"), inverseJoinColumns = @JoinColumn(name = "CONNECTION_ID", referencedColumnName = "CONNECTION_ID"))
	@OneToMany(orphanRemoval = true)
	private List<Connection> inputConnections = new ArrayList<Connection>();
	
	@JoinTable(name = "STATE_OUTPUT_CONNECTIONS", joinColumns = @JoinColumn(name = "STATE_ID", referencedColumnName = "STATE_ID"), inverseJoinColumns = @JoinColumn(name = "CONNECTION_ID", referencedColumnName = "CONNECTION_ID"))
	@OneToMany(orphanRemoval = true)
	private List<Connection> outputConnections = new ArrayList<Connection>();

	public State() {
		super();
	}

	public State(Game game, String gameStateId, Float positionX, Float positionY) {
		super();
		this.game = game;
		this.gameStateId = gameStateId;
		this.positionX = positionX;
		this.positionY = positionY;
	}

	public Integer getStateId() {
		return stateId;
	}

	public void setStateId(Integer stateId) {
		this.stateId = stateId;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public String getGameStateId() {
		return gameStateId;
	}

	public void setGameStateId(String gameStateId) {
		this.gameStateId = gameStateId;
	}

	public Float getPositionX() {
		return positionX;
	}

	public void setPositionX(Float positionX) {
		this.positionX = positionX;
	}

	public Float getPositionY() {
		return positionY;
	}

	public void setPositionY(Float positionY) {
		this.positionY = positionY;
	}

	public List<Connection> getInputConnections() {
		return inputConnections;
	}

	public void setInputConnections(List<Connection> inputConnections) {
		this.inputConnections = inputConnections;
	}

	public List<Connection> getOutputConnections() {
		return outputConnections;
	}

	public void setOutputConnections(List<Connection> outputConnections) {
		this.outputConnections = outputConnections;
	}

}
