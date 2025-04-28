package AS_API.controller;

import AS_API.dto.BillRankingDto;
import AS_API.service.BillStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillStatusController {

    private final BillStatusService billStatusService;

    @GetMapping("/ranking")
    public ResponseEntity<Page<BillRankingDto>> getBillRanking(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "billCount"));
        return ResponseEntity.ok(billStatusService.getBillRanking(pageable));
    }

    @GetMapping("/ranking/bookmark")
    public ResponseEntity<Page<BillRankingDto>> getBookmarkRanking(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(billStatusService.getBookmarkRanking(pageable));
    }

}
