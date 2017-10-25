package wlcp.model.master.state;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: DisplayTextState
 *
 */
@Entity
@Table(name = "DISPLAY_TEXT")
@PrimaryKeyJoinColumn(referencedColumnName = "STATE_ID")
public class DisplayTextState extends State implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Column(length = 255, name = "DISPLAY_TEXT")
	private String displayText;

	public DisplayTextState() {
		super();
		setStateType(StateType.DISPLAY_TEXT_STATE);
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
   
}
