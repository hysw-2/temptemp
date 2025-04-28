package AS_API.repository;

import AS_API.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUid(String uid);
    Optional<User> findByUserId(Long userId);
}
