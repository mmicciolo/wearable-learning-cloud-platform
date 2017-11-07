package wlcp.model.master.state;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: DisplayTextStateMap
 *
 */
@Entity
@Table(name = "DISPLAY_TEXT_STATE_MAP")
//@Embeddable
public class DisplayTextStateMap implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "DISPLAY_TEXT_STATE_MAP_ID")
	private Integer displayTextStateMapId;
	
	@Column(length = 40, name = "SCOPE")
	private String scope;
	
	@Column(length = 255, name = "DISPLAY_TEXT")
	private String displayText;

	public DisplayTextStateMap() {
		super();
	}

	public DisplayTextStateMap(String scope, String displayText) {
		super();
		this.scope = scope;
		this.displayText = displayText;
	}

	public Integer getDisplayTextStateMapId() {
		return displayTextStateMapId;
	}

	public void setDisplayTextStateMapId(Integer displayTextStateMapId) {
		this.displayTextStateMapId = displayTextStateMapId;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getDisplayText() {
		return displayText;
	}

	public void setDisplayText(String displayText) {
		this.displayText = displayText;
	}
   
}
