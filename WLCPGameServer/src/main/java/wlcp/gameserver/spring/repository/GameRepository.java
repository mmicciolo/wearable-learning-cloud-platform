package wlcp.gameserver.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wlcp.model.master.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, String> {

}
