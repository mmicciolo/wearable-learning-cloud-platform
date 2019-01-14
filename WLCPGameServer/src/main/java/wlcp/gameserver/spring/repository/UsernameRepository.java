package wlcp.gameserver.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import wlcp.model.master.Username;

@Repository
public interface UsernameRepository extends JpaRepository<Username, String> {

}
