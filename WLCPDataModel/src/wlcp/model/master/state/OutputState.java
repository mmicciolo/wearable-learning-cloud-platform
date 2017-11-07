package wlcp.model.master.state;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: OutputState
 *
 */
@Entity
@Table(name = "OUTPUT_STATE")
@PrimaryKeyJoinColumn(referencedColumnName = "STATE_ID")
public class OutputState extends State implements Serializable {

	
	private static final long serialVersionUID = 1L;

	public OutputState() {
		super();
		setStateType(StateType.OUTPUT_STATE);
	}
   
}
