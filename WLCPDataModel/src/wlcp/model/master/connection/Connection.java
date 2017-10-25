package wlcp.model.master.connection;

import java.io.Serializable;
import javax.persistence.*;

import wlcp.model.master.Game;

/**
 * Entity implementation class for Entity: Connection
 *
 */
@Entity
@Table(name = "CONNECTION")
public class Connection implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CONNECTION_ID")
	private Integer connectionId;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "GAME")
	private Game game;
	
	@Column(length = 40, name = "GAME_CONNECTION_ID")
	private String gameConnectionId;
	
	@Column(length = 40, name = "CONNECTION_FROM")
	private String connectionFrom;
	
	@Column(length = 40, name = "CONNECTION_TO")
	private String connectionTo;

	public Connection() {
		super();
	}

	public Connection(Game game, String gameConnectionId, String connectionFrom, String connectionTo) {
		super();
		this.game = game;
		this.gameConnectionId = gameConnectionId;
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
	}

	public Integer getConnectionId() {
		return connectionId;
	}

	public void setConnectionId(Integer connectionId) {
		this.connectionId = connectionId;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public String getGameConnectionId() {
		return gameConnectionId;
	}

	public void setGameConnectionId(String gameConnectionId) {
		this.gameConnectionId = gameConnectionId;
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
