package AS_API.dto;

import AS_API.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class LoginResponseDto {
    private Long userId;
    private String name;
    private String uid;
    private String phoneNumber;
    private String email;
    private Role role;
    private String nickName;
    private String accessToken;

}
