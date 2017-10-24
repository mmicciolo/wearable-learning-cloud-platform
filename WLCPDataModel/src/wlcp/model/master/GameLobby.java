package wlcp.model.master;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: GameLobby
 *
 */
@Entity
@Table(name = "GAME_LOBBY")
public class GameLobby implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "GAME_LOBBY_ID")
	private Integer gameLobbyId;
	
	@Column(length = 40, name = "GAME_LOBBY_NAME")
	private String gameLobbyName;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "USERNAME", nullable = false)
	private Username username;

	public GameLobby() {
		super();
	}

	public GameLobby(String gameLobbyName, Username username) {
		super();
		this.gameLobbyName = gameLobbyName;
		this.username = username;
	}

	public Integer getGameLobbyId() {
		return gameLobbyId;
	}

	public void setGameLobbyId(Integer gameLobbyId) {
		this.gameLobbyId = gameLobbyId;
	}

	public String getGameLobbyName() {
		return gameLobbyName;
	}

	public void setGameLobbyName(String gameLobbyName) {
		this.gameLobbyName = gameLobbyName;
	}

	public Username getUsername() {
		return username;
	}

	public void setUsername(Username username) {
		this.username = username;
	}

}
