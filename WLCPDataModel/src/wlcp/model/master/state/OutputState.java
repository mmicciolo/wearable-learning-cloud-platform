package wlcp.model.master.state;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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
	
	@JoinTable(name = "DISPLAY_TEXT_MAP", joinColumns = @JoinColumn(name = "STATE_ID", referencedColumnName = "STATE_ID"), inverseJoinColumns = @JoinColumn(name = "DISPLAY_TEXT_STATE_MAP_ID", referencedColumnName = "DISPLAY_TEXT_STATE_MAP_ID"))
	@OneToMany(cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<DisplayTextStateMap> displayTextStateMap = new ArrayList<DisplayTextStateMap>();

	public OutputState() {
		super();
		setStateType(StateType.OUTPUT_STATE);
	}

	public List<DisplayTextStateMap> getDisplayTextStateMap() {
		return displayTextStateMap;
	}

	public void setDisplayTextStateMap(List<DisplayTextStateMap> displayTextStateMap) {
		this.displayTextStateMap = displayTextStateMap;
	}

}
