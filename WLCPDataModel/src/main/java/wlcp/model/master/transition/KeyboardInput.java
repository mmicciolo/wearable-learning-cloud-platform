package wlcp.model.master.transition;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Entity implementation class for Entity: KeyboardInput
 *
 */
@Entity
@Table(name = "KEYBOARD_INPUT")
public class KeyboardInput implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "KEYBOARD_INPUT_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer keyboardInputId;
	
	@JoinColumn(name = "TRANSITION_ID")
	@JsonIgnoreProperties(value= {"game", "connection", "activeTransitions", "singleButtonPresses", "sequenceButtonPresses", "keyboardInputs"})
	private Transition transition;
	
	@Column(name = "SCOPE")
	private String scope;
	
	@ElementCollection
	@CollectionTable(name="KEYBOARD_INPUTS", joinColumns=@JoinColumn(name="KEYBOARD_INPUT_ID"))
	@Column(name="KEYBOARD_INPUT")
	@OneToMany(orphanRemoval = true)
	private List<String> keyboardInputs = new ArrayList<String>();

	public KeyboardInput() {
		super();
	}

	public KeyboardInput(Transition transition, String scope, List<String> keyboardInputs) {
		super();
		this.transition = transition;
		this.scope = scope;
		this.keyboardInputs = keyboardInputs;
	}

	public Integer getKeyboardInputId() {
		return keyboardInputId;
	}

	public void setKeyboardInputId(Integer keyboardInputId) {
		this.keyboardInputId = keyboardInputId;
	}

	public Transition getTransition() {
		return transition;
	}

	public void setTransition(Transition transition) {
		this.transition = transition;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public List<String> getKeyboardInputs() {
		return keyboardInputs;
	}

	public void setKeyboardInputs(List<String> keyboardInputs) {
		this.keyboardInputs = keyboardInputs;
	}
   
}
