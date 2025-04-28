package AS_API.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BillProposerDto {
    private Long id;
    private String name;
    private String career;
    private String party;
}
