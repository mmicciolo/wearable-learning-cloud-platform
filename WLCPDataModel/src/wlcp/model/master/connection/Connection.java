package wlcp.model.master.connection;

import java.io.Serializable;
import javax.persistence.*;

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
	
	@Column(length = 40, name = "FROM")
	private String from;
	
	@Column(length = 40, name = "TO")
	private String to;
	
	public Connection() {
		super();
	}
   
}
