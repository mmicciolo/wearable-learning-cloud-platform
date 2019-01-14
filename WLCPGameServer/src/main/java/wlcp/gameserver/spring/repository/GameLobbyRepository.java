package wlcp.gameserver.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wlcp.model.master.GameLobby;

@Repository
public interface GameLobbyRepository extends JpaRepository<GameLobby, Integer> {

}
