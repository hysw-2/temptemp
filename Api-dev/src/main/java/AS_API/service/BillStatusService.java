package AS_API.service;

import AS_API.dto.BillRankingDto;
import AS_API.dto.BillStatusUpdateDto;
import AS_API.entity.BillStatus;
import AS_API.repository.BillStatusRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BillStatusService {

    private final BillStatusRepository billStatusRepository;

    public Page<BillRankingDto> getBillRanking(Pageable pageable) {
        return billStatusRepository.findAllRanked(pageable);
    }

    public Page<BillRankingDto> getBookmarkRanking(Pageable pageable) {
        return billStatusRepository.findAllRankedByBookmark(pageable);
    }

    @Transactional
    public void updateStatus(BillStatus status, BillStatusUpdateDto dto) {
        BillStatus managedStatus = billStatusRepository.findById(status.getDocumentId())
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found"));

        // 변경 로직 캡슐화
        managedStatus.update(dto.getYes(), dto.getNo());
    }

}
