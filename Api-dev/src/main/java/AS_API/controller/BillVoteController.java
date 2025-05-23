package AS_API.controller;

import AS_API.config.CustomUserDetails;
import AS_API.entity.BillVote.VoteType;
import AS_API.service.BillVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillVoteController {

    private final BillVoteService billVoteService;

    @PostMapping("/{billId}/vote")
    public ResponseEntity<String> vote(
            @PathVariable Long billId,
            @RequestParam VoteType voteType,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUser().getUserId();
        String result = billVoteService.vote(userId, billId, voteType);
        return ResponseEntity.ok(result);
    }
}
