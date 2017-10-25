package wlcp.model.master.connection;

import java.io.Serializable;
import javax.persistence.*;

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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CONNECTION_ID")
	private Integer connectionId;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "STATE")
	private State state;
	
	@Column(length = 40, name = "CONNECTION_FROM")
	private String connectionFrom;
	
	@Column(length = 40, name = "CONNECTION_TO")
	private String connectionTo;

	public Connection() {
		super();
	}
	
	public Connection(State state, String connectionFrom, String connectionTo) {
		super();
		this.state = state;
		this.connectionFrom = connectionFrom;
		this.connectionTo = connectionTo;
	}

	public Integer getConnectionId() {
		return connectionId;
	}

	public void setConnectionId(Integer connectionId) {
		this.connectionId = connectionId;
	}
	
	public State getState() {
		return state;
	}

	public void setState(State state) {
		this.state = state;
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
