package AS_API.service;

import AS_API.dto.BillRankingDto;
import AS_API.repository.BillStatusRepository;
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

}
