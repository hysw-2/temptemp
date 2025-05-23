package AS_API.repository;

import AS_API.dto.BillDto;
import AS_API.dto.BillDetailDto;
import AS_API.entity.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {

    @Query("SELECT new AS_API.dto.BillDto(b.billId, b.apiId, b.billNumber, b.billTitle, " +
            "b.billProposer, b.committee, b.billStatus) " +
            "FROM Bill b " +
            "WHERE (:title IS NOT NULL AND b.billTitle LIKE CONCAT('%', :title, '%') OR :title IS NULL) " +
            "AND (:proposer IS NOT NULL AND b.billProposer LIKE CONCAT('%', :proposer, '%') OR :proposer IS NULL) " +
            "AND (:detail IS NOT NULL AND b.detail LIKE CONCAT('%', :detail, '%') OR :detail IS NULL)")
    Page<BillDto> searchBills(@Param("title") String title,
                              @Param("proposer") String proposer,
                              @Param("detail") String detail,
                              Pageable pageable);

    @Query("SELECT new AS_API.dto.BillDetailDto(b.billId, b.apiId, b.billNumber, b.billTitle, " +
            "b.billProposer, b.committee, b.billStatus, b.billDate, b.detail, b.summary, b.prediction, b.term) " +
            "FROM Bill b WHERE b.billId = :billId")
    Optional<BillDetailDto> findBillDetailById(@Param("billId") Long billId);
}
