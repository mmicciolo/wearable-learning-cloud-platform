package wlcp.model.master.connection;

import java.io.Serializable;
import javax.persistence.*;

import wlcp.model.master.Game;
import wlcp.model.master.state.State;

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

	public Connection() {
		super();
	}

	public Connection(String connectionId, Game game, String connectionFrom, String connectionTo) {
		super();
		this.connectionId = connectionId;
		this.game = game;
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
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

}
