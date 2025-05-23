package AS_API.dto;

import lombok.Getter;

@Getter
public class LoginRequestDto {
    String uid;
    String password;
}