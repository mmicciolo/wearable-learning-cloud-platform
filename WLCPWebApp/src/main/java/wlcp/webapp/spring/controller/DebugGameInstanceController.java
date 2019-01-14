package wlcp.webapp.spring.controller;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import wlcp.model.master.Username;

@Controller
@RequestMapping("/Controllers")
public class DebugGameInstanceController {
	
	@Inject
	EntityManager entityManager;
	
	@GetMapping(value="/checkDebugInstanceRunning")
    @ResponseBody()
	public ResponseEntity<Boolean> checkDebugInstanceRunning(@RequestParam("usernameId") String usernameId)  {
		if(entityManager.find(Username.class, usernameId) != null) {
			if(entityManager.createQuery("SELECT g FROM GameInstance g WHERE g.username.usernameId = " + "'" + usernameId + "'" + " AND g.debugInstance = TRUE").getResultList().size() > 0) {
				return ResponseEntity.status(HttpStatus.OK).body(true);
			}
			return ResponseEntity.status(HttpStatus.OK).body(false);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
		}
	}

}
