package wlcp.gameserver.spring.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wlcp.model.master.GameInstance;

@Repository
public interface GameInstanceRepository extends JpaRepository<GameInstance, Integer> {
	
}
