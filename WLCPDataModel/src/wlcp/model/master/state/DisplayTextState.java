package wlcp.model.master.state;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: DisplayTextState
 *
 */
@Entity
@Table(name = "DISPLAY_TEXT_STATE")
@PrimaryKeyJoinColumn(referencedColumnName = "STATE_ID")
public class DisplayTextState extends State implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Column(length = 255, name = "DISPLAY_TEXT")
	private String displayText;
	
//	@ElementCollection
//    @MapKeyColumn(name="SCOPE")
//    @Column(name="DISPLAY_TEXT")
//    @CollectionTable(name="DISPLAY_TEXT_MAP", joinColumns=@JoinColumn(name="STATE_ID"))
//    Map<String, String> attribute = new HashMap<String, String>();
	
	@JoinTable(name = "DISPLAY_TEXT_MAP", joinColumns = @JoinColumn(name = "STATE_ID", referencedColumnName = "STATE_ID"), inverseJoinColumns = @JoinColumn(name = "DISPLAY_TEXT_STATE_MAP_ID", referencedColumnName = "DISPLAY_TEXT_STATE_MAP_ID"))
	@OneToMany(orphanRemoval = true)
	//@ElementCollection
    //@CollectionTable(name="DISPLAY_TEXT_MAP", joinColumns=@JoinColumn(name="STATE_ID"))
	private List<DisplayTextStateMap> displayTextStateMap = new ArrayList<DisplayTextStateMap>();

	public DisplayTextState() {
		super();
		setStateType(StateType.DISPLAY_TEXT_STATE);
		//attribute.put("GameWide", "SUP GAME");
		//attribute.put("Player1", "SUP GAME2");
	}

	public DisplayTextState(String displayText) {
		super();
		this.displayText = displayText;
	}

	public String getDisplayText() {
		return displayText;
	}

	public void setDisplayText(String displayText) {
		this.displayText = displayText;
	}

	public List<DisplayTextStateMap> getDisplayTextStateMap() {
		return displayTextStateMap;
	}

	public void setDisplayTextStateMap(List<DisplayTextStateMap> displayTextStateMap) {
		this.displayTextStateMap = displayTextStateMap;
	}
	
	

//	public Map<String, String> getAttribute() {
//		return attribute;
//	}
//
//	public void setAttribute(Map<String, String> attribute) {
//		this.attribute = attribute;
//	}
   
}
