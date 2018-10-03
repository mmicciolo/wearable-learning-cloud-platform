package wlcp.webapp.spring.controller;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import wlcp.model.master.Game;
import wlcp.model.master.connection.Connection;
import wlcp.model.master.state.State;
import wlcp.model.master.transition.Transition;

@Controller
@RequestMapping("/Controllers")
public class LoadSaveController {
	
	@Inject
	EntityManager entityManager;

	@GetMapping(value="/loadGame")
    @ResponseBody()
	public Game enqueueCalculation(@RequestParam("gameId") String gameId) {
		return entityManager.find(Game.class, gameId);
	}
	
	@PostMapping(value="/saveGame")
	@Transactional
	public ResponseEntity<?> saveGame(@RequestBody Game game) {
		for(State state : game.getStates()) {
			state.setGame(game);
			entityManager.merge(state);
		}
		for(Connection connection : game.getConnections()) {
			connection.setGame(game);
			entityManager.merge(connection);
		}
		for(Transition transition : game.getTransitions()) {
			transition.setGame(game);
			entityManager.merge(transition);
		}
		entityManager.merge(game);
		return new ResponseEntity<>("{}", HttpStatus.OK);
	}

}
