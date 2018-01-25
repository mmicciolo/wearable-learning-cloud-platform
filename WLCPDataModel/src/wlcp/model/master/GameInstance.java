package wlcp.model.master;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: GameInstance
 *
 */
@Entity
@Table(name = "GAME_INSTANCE")
public class GameInstance implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "GAME_INSTANCE_ID")
	private Integer gameInstanceId;
	
	@OneToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "GAME_LOBBY", referencedColumnName = "GAME_LOBBY_ID")
	private GameLobby gameLobby;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "GAME", referencedColumnName = "GAME_ID")
	private Game game;
	
	public GameInstance() {
		super();
	}

	public GameInstance(GameLobby gameLobby, Game game) {
		super();
		this.gameLobby = gameLobby;
		this.game = game;
	}

	public Integer getGameInstanceId() {
		return gameInstanceId;
	}

	public void setGameInstanceId(Integer gameInstanceId) {
		this.gameInstanceId = gameInstanceId;
	}

	public GameLobby getGameLobby() {
		return gameLobby;
	}

	public void setGameLobby(GameLobby gameLobby) {
		this.gameLobby = gameLobby;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}
   
}
