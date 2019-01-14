package wlcp.gameserver.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wlcp.model.master.GameInstance;
import wlcp.model.master.Username;

@Repository
public interface GameInstanceRepository extends JpaRepository<GameInstance, Integer> {
	List<GameInstance> findByUsernameAndDebugInstance(Username username, Boolean debugInstance);
}
