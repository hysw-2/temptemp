package AS_API.service;

import AS_API.dto.BillStatusUpdateDto;
import AS_API.entity.*;
import AS_API.entity.BillVote.VoteType;
import AS_API.repository.BillRepository;
import AS_API.repository.BillVoteRepository;
import AS_API.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BillVoteService {

    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final BillVoteRepository voteRepository;
    private final BillStatusService billStatusService;

    @Transactional
    public String vote(Long userId, Long billId, VoteType newVote) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("법안을 찾을 수 없습니다."));
        BillStatus status = bill.getBillStatusDetail();
        if (status == null) {
            throw new IllegalStateException("해당 법안의 상태 정보가 없습니다.");
        }

        BillVote existingVote = voteRepository.findByUserAndBill(user, bill).orElse(null);

        int yes = status.getYes();
        int no = status.getNo();

        if (existingVote != null) {
            VoteType currentVote = existingVote.getVoteType();

            if (currentVote == newVote) {
                // 취소
                if (newVote == VoteType.YES) yes--;
                else no--;

                voteRepository.delete(existingVote);
                billStatusService.updateStatus(status, new BillStatusUpdateDto(yes, no));
                return "투표가 취소되었습니다.";
            } else {
                // 변경
                if (currentVote == VoteType.YES) {
                    yes--; no++;
                } else {
                    no--; yes++;
                }

                existingVote.setVoteType(newVote);
                billStatusService.updateStatus(status, new BillStatusUpdateDto(yes, no));
                return "투표가 변경되었습니다.";
            }
        } else {
            // 신규 투표
            if (newVote == VoteType.YES) yes++;
            else no++;

            voteRepository.save(new BillVote(user, bill, newVote));
            billStatusService.updateStatus(status, new BillStatusUpdateDto(yes, no));
            return "투표가 등록되었습니다.";
        }
    }
}
