package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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
	
	@JoinTable(name = "GAMELOBBY_USERS", joinColumns = @JoinColumn(name = "GAME_LOBBY_ID", referencedColumnName = "GAME_LOBBY_ID"), inverseJoinColumns = @JoinColumn(name = "USERNAME_ID", referencedColumnName = "USERNAME_ID"))
	@OneToMany(cascade = CascadeType.PERSIST)
	private List<Username> gameLobbyUsers = new ArrayList<Username>();

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

	public List<Username> getGameLobbyUsers() {
		return gameLobbyUsers;
	}

	public void setGameLobbyUsers(List<Username> gameLobbyUsers) {
		this.gameLobbyUsers = gameLobbyUsers;
	}

}
