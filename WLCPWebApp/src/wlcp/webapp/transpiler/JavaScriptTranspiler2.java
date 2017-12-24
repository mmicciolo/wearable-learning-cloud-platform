package wlcp.webapp.transpiler;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.OutputState;
import wlcp.model.master.state.StartState;
import wlcp.model.master.transition.Transition;
import wlcp.webapp.transpiler.steps.GenerateNameSpaceAndVariablesStep;
import wlcp.webapp.transpiler.steps.GenerateStartFunctionStep;
import wlcp.webapp.transpiler.steps.GenerateStateEnumStep;
import wlcp.webapp.transpiler.steps.GenerateStateMachineFunctionsStep;
import wlcp.webapp.transpiler.steps.GenerateStateMachineStep;
import wlcp.webapp.transpiler.steps.ITranspilerStep;

public class JavaScriptTranspiler2 implements ITranspiler {
	
	private EntityManager entityManager = null;
	private StringBuilder stringBuilder = new StringBuilder();
	private List<ITranspilerStep> transpilerSteps = new ArrayList<ITranspilerStep>();
	
	private Game game;
	private StartState startState;
	private List<OutputState> outputStates;
	private List<Connection> connections;
	private List<Transition> transitions;
	
	public JavaScriptTranspiler2(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	@Override
	public void LoadData(String gameId) {
		game = entityManager.find(Game.class, gameId);
		startState = entityManager.createQuery("SELECT s FROM StartState s WHERE s.game.gameId = '" + game.getGameId() + "'", StartState.class).getResultList().get(0);
		outputStates = entityManager.createQuery("SELECT s FROM OutputState s WHERE s.game.gameId = '" + game.getGameId() + "'", OutputState.class).getResultList();
		connections = entityManager.createQuery("SELECT s FROM Connection s WHERE s.game.gameId = '" + game.getGameId() + "'", Connection.class).getResultList();
		transitions = entityManager.createQuery("SELECT s FROM Transition s WHERE s.game.gameId = '" + game.getGameId() + "'", Transition.class).getResultList();
	}

	@Override
	public void Transpile(String gameId) {
		
		//Load the data
		LoadData(gameId);
		
		//Setup the transpiler steps
		SetupTranspilerSteps();
		
		//Loop through the steps
		for(ITranspilerStep step : transpilerSteps) {
			stringBuilder.append(step.PerformStep());
		}
		
		System.out.println(stringBuilder.toString());
	}
	
	private void SetupTranspilerSteps() {
		transpilerSteps.add(new GenerateStateEnumStep(startState, outputStates));
		transpilerSteps.add(new GenerateNameSpaceAndVariablesStep(startState));
		transpilerSteps.add(new GenerateStartFunctionStep());
		transpilerSteps.add(new GenerateStateMachineStep(startState, outputStates));
		transpilerSteps.add(new GenerateStateMachineFunctionsStep(startState, outputStates, connections, transitions));
	}

}
