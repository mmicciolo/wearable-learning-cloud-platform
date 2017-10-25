/**
 * 
 */

//var StateType = {
//		DISPLAY_STATE: 1
//};

class StateFactory {
	
	static createState(stateType) {
		switch(stateType) {
		case StateType.DISPLAY_STATE:
			var i = 0;
			break;
		}
	}
	
}

class TransitionFactory {
	
	static createTransition(transitionClass) {
		var transition = new GameEditor["Transition"]();
		var i = 0;
	}
}