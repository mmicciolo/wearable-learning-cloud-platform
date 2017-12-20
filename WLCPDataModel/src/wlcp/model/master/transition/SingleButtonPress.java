package wlcp.model.master.transition;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: SingleButtonPress
 *
 */
@Entity
@Table(name = "SINGLE_BUTTON_PRESS")
public class SingleButtonPress implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "SINGLE_BUTTON_PRESS_ID")
	private int singleButtonPressId;
	
	@Column(name = "SCOPE")
	private String scope;
	
	@Column(name = "BUTTON_1")
	private Boolean button1;
	
	@Column(name = "BUTTON_2")
	private Boolean button2;
	
	@Column(name = "BUTTON_3")
	private Boolean button3;
	
	@Column(name = "BUTTON_4")
	private Boolean button4;

	public SingleButtonPress() {
		super();
	}

	public SingleButtonPress(String scope, Boolean button1, Boolean button2, Boolean button3, Boolean button4) {
		super();
		this.scope = scope;
		this.button1 = button1;
		this.button2 = button2;
		this.button3 = button3;
		this.button4 = button4;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public int getSingleButtonPressId() {
		return singleButtonPressId;
	}

	public void setSingleButtonPressId(int singleButtonPressId) {
		this.singleButtonPressId = singleButtonPressId;
	}

	public Boolean getButton1() {
		return button1;
	}

	public void setButton1(Boolean button1) {
		this.button1 = button1;
	}

	public Boolean getButton2() {
		return button2;
	}

	public void setButton2(Boolean button2) {
		this.button2 = button2;
	}

	public Boolean getButton3() {
		return button3;
	}

	public void setButton3(Boolean button3) {
		this.button3 = button3;
	}

	public Boolean getButton4() {
		return button4;
	}

	public void setButton4(Boolean button4) {
		this.button4 = button4;
	}
   
}
