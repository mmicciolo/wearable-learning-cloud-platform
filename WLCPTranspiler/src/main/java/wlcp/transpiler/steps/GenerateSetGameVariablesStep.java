package wlcp.transpiler.steps;

public class GenerateSetGameVariablesStep implements ITranspilerStep {
	
	@Override
	public String PerformStep() {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("var SetGameVariables = function(gameInstanceId, team, player, playerVM) {\n");
		stringBuilder.append("   FSMGame.gameInstanceId = gameInstanceId;\n");
		stringBuilder.append("   FSMGame.team = team;\n");
		stringBuilder.append("   FSMGame.player = player;\n");
		stringBuilder.append("   FSMGame.playerVM = playerVM;\n");
		stringBuilder.append("}\n\n");
		return stringBuilder.toString();
	}
}
