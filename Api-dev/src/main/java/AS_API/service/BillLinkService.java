package AS_API.service;

import AS_API.repository.BillStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class BillLinkService {

    private final BillStatusRepository billStatusRepository;

    @SuppressWarnings("unchecked")
    public Map<String, Object> getLinkByBillId(Long billId) {
        return billStatusRepository.findByBill_BillId(billId)
                .map(status -> (Map<String, Object>) (Map) Map.of(
                        "billId", billId,
                        "link", status.getLink()
                ))
                .orElseThrow(() -> new IllegalArgumentException("해당 billId의 BillStatus를 찾을 수 없습니다."));
    }
}
