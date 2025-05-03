package AS_API.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BillRankingDto {
    private Long billId;
    private String billTitle;
    private String proposer;
    private int billCount;
    private int bookmarkCount;
}
