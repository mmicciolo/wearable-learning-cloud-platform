package wlcp.model.master.state;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;

/**
 * Entity implementation class for Entity: State
 *
 */
@Entity
@Table(name = "STATE")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property="stateType", defaultImpl=State.class)
@JsonSubTypes({@Type(value = StartState.class, name="START_STATE"), @Type(value = OutputState.class, name = "OUTPUT_STATE")})
public class State implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "STATE_ID")
	private String stateId;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "GAME")
	@JsonIgnore
	private Game game;
	
	@Enumerated(EnumType.ORDINAL)
	@Column(name = "STATE_TYPE")
	private StateType stateType;
	
	@Column(name = "POSITION_X")
	private Float positionX;
	
	@Column(name = "POSITION_Y")
	private Float positionY;
	
	@JoinTable(name = "INPUT_CONNECTIONS", joinColumns = @JoinColumn(name = "STATE_ID", referencedColumnName = "STATE_ID"), inverseJoinColumns = @JoinColumn(name = "CONNECTION_ID", referencedColumnName = "CONNECTION_ID"))
	@OneToMany(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
	@JsonIgnoreProperties(value = {"game", "connectionFrom", "connectionTo", "transition", "backwardsLoop"})
	List<Connection> inputConnections = new ArrayList<Connection>();
	
	@JoinTable(name = "OUTPUT_CONNECTIONS", joinColumns = @JoinColumn(name = "STATE_ID", referencedColumnName = "STATE_ID"), inverseJoinColumns = @JoinColumn(name = "CONNECTION_ID", referencedColumnName = "CONNECTION_ID"))
	@OneToMany(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
	@JsonIgnoreProperties(value = {"game", "connectionFrom", "connectionTo", "transition", "backwardsLoop"})
	List<Connection> outputConnections = new ArrayList<Connection>();

	public State() {
		super();
	}
	
	public State(String stateId, Game game, StateType stateType, Float positionX, Float positionY,
			List<Connection> inputConnections, List<Connection> outputConnections) {
		super();
		this.stateId = stateId;
		this.game = game;
		this.stateType = stateType;
		this.positionX = positionX;
		this.positionY = positionY;
		this.inputConnections = inputConnections;
		this.outputConnections = outputConnections;
	}

	public String getStateId() {
		return stateId;
	}

	public void setStateId(String stateId) {
		this.stateId = stateId;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public StateType getStateType() {
		return stateType;
	}

	public void setStateType(StateType stateType) {
		this.stateType = stateType;
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
