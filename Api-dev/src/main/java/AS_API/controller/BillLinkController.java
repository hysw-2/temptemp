package AS_API.controller;

import AS_API.service.BillLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillLinkController {

    private final BillLinkService billLinkService;

    @GetMapping("/{billId}/link")
    public ResponseEntity<?> getBillLinkFromStatus(@PathVariable Long billId) {
        try {
            return ResponseEntity.ok(billLinkService.getLinkByBillId(billId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(
                    Map.of("error", e.getMessage())
            );
        }
    }
}
