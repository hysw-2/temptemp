package AS_API.service;

import AS_API.dto.BillDto;
import AS_API.dto.BillDetailDto;
import AS_API.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BillService {
    private final BillRepository billRepository;

    public Page<BillDto> searchBills(String title, String proposer, String detail, Pageable pageable) {
        return billRepository.searchBills(
                (title == null || title.trim().isEmpty()) ? null : title,
                (proposer == null || proposer.trim().isEmpty()) ? null : proposer,
                (detail == null || detail.trim().isEmpty()) ? null : detail,
                pageable
        );
    }

    public Optional<BillDetailDto> getBillDetail(Long billId) {
        return billRepository.findBillDetailById(billId);
    }
}
