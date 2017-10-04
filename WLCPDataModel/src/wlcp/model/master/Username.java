package wlcp.model.master;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Username
 *
 */
@Entity
@Table(name = "USERNAME")
public class Username implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(length = 40, name = "USERNAME")
	private String username;
	
	@Column(length = 40, name = "PASSWORD")
	private String password;
	
	@Column(length = 40, name = "FIRST_NAME")
	private String firstName;
	
	@Column(length = 40, name = "LAST_NAME")
	private String lastName;
	
	@Column(length = 40, name = "EMAIL_ADDRESS")
	private String emailAddress;
	
	
	@JoinTable(name = "USERNAME_GAMELOBBIES", joinColumns = @JoinColumn(name = "USERNAME", referencedColumnName = "USERNAME"), inverseJoinColumns = @JoinColumn(name = "GAME_LOBBY", referencedColumnName = "GAME_LOBBY_ID"))
	@OneToMany
	//@OneToMany(cascade = CascadeType.PERSIST, mappedBy = "username")
	private List<GameLobby> gameLobbies = new ArrayList<GameLobby>();

	public Username() {
		super();
	}

	public Username(String username, String password, String firstName, String lastName, String emailAddress) {
		super();
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.emailAddress = emailAddress;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public List<GameLobby> getGameLobbies() {
		return gameLobbies;
	}

	public void setGameLobbies(List<GameLobby> gameLobbies) {
		this.gameLobbies = gameLobbies;
	}
   
}
