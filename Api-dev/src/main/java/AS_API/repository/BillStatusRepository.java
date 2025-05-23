package AS_API.repository;

import AS_API.dto.BillRankingDto;
import AS_API.entity.BillStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BillStatusRepository extends JpaRepository<BillStatus, Long> {

    @Query("SELECT new AS_API.dto.BillRankingDto(" +
            "bs.bill.billId, bs.bill.billTitle, bs.bill.billProposer, bs.billCount, bs.bookmarkCount) " +
            "FROM BillStatus bs " +
            "ORDER BY bs.billCount DESC")
    Page<BillRankingDto> findAllRanked(Pageable pageable);

    @Query("SELECT new AS_API.dto.BillRankingDto(" +
            "bs.bill.billId, bs.bill.billTitle, bs.bill.billProposer, bs.billCount, bs.bookmarkCount) " +
            "FROM BillStatus bs " +
            "ORDER BY bs.bookmarkCount DESC, bs.billCount DESC")
    Page<BillRankingDto> findAllRankedByBookmark(Pageable pageable);

    Optional<BillStatus> findByBill_BillId(Long billId);


}
