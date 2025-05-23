package AS_API.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BillProposerDetailDto {
    private Long id;
    private String name;
    private String career;
    private String party;
    private String birth;
    private String job;
    private String origin;
    private String committees;
    private String memberTitle;
}
