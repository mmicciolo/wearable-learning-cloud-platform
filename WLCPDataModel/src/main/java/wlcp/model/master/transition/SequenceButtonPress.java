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
 * Entity implementation class for Entity: SequenceButtonPress
 *
 */

@Entity
@Table(name = "SEQUENCE_BUTTON_PRESS")
public class SequenceButtonPress implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "SEQUENCE_BUTTON_PRESS_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer sequenceButtonPressId;
	
	@JoinColumn(name = "TRANSITION_ID")
	@JsonIgnoreProperties(value= {"game", "connection", "activeTransitions", "singleButtonPresses", "sequenceButtonPresses", "keyboardInputs"})
	private Transition transition;
	
	@Column(name = "SCOPE")
	private String scope;
	
	@ElementCollection
	@CollectionTable(name="SEQUENCE_BUTTON_PRESSES", joinColumns=@JoinColumn(name="SEQUENCE_BUTTON_PRESS_ID"))
	@Column(name="SEQUENCES")
	@OneToMany(orphanRemoval = true)
	private List<String> sequences = new ArrayList<String>();

	public SequenceButtonPress() {
		super();
	}

	public SequenceButtonPress(Transition transition, String scope, List<String> sequences) {
		super();
		this.transition = transition;
		this.scope = scope;
		this.sequences = sequences;
	}

	public Integer getSequenceButtonPressId() {
		return sequenceButtonPressId;
	}

	public void setSequenceButtonPressId(Integer sequenceButtonPressId) {
		this.sequenceButtonPressId = sequenceButtonPressId;
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

	public List<String> getSequences() {
		return sequences;
	}

	public void setSequences(List<String> sequences) {
		this.sequences = sequences;
	}

}
