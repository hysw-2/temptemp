package AS_API.repository;

import AS_API.dto.BillProposerDetailDto;
import AS_API.dto.BillProposerDto;
import AS_API.entity.BillProposer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BillProposerRepository extends JpaRepository<BillProposer, Long> {

    @Query("SELECT new AS_API.dto.BillProposerDto(p.proposerId, p.proposerName, p.job, p.poly) " +
            "FROM BillProposer p " +
            "WHERE (:keyword IS NULL OR p.proposerName LIKE CONCAT('%', :keyword, '%'))")
    Page<BillProposerDto> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT new AS_API.dto.BillProposerDetailDto(p.proposerId, p.proposerName, p.job, p.poly, " +
            "p.bth, p.job, p.orig, p.cmits, p.memTitle) " +
            "FROM BillProposer p WHERE p.proposerId = :id")
    Optional<BillProposerDetailDto> findProposerDetailById(@Param("id") Long id);

}
