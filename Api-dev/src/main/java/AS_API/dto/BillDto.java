package AS_API.dto;

import lombok.Getter;

@Getter
public class BillDto {
    private Long billId;
    private String apiId;
    private Long billNumber;
    private String billTitle;
    private String billProposer;
    private String committee;
    private String billStatus;

    public BillDto(Long billId, String apiId, Long billNumber, String billTitle,
                   String billProposer, String committee, String billStatus) {
        this.billId = billId;
        this.apiId = apiId;
        this.billNumber = billNumber;
        this.billTitle = billTitle;
        this.billProposer = billProposer;
        this.committee = committee;
        this.billStatus = billStatus;
    }
}
