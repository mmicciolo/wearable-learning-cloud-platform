package wlcp.model.master.state;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: StartState
 *
 */
@Entity
@Table(name = "START_STATE")
@PrimaryKeyJoinColumn(referencedColumnName = "STATE_ID")
public class StartState extends State implements Serializable {

	
	private static final long serialVersionUID = 1L;

	public StartState() {
		super();
		setStateType(StateType.START_STATE);
	}
   
}
