package AS_API.repository;

import AS_API.entity.BlackList;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlackListRepository extends CrudRepository<BlackList, String> {

    boolean existsByAccessToken(String accessToken);
    Optional<BlackList> findByStudentNumber(String studentNumber);

}
