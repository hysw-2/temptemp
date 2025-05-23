package AS_API.repository;

import AS_API.entity.Bill;
import AS_API.entity.BillVote;
import AS_API.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BillVoteRepository extends JpaRepository<BillVote, Long> {
    Optional<BillVote> findByUserAndBill(User user, Bill bill);
}
