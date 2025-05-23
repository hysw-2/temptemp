package AS_API.service;

import AS_API.config.CustomUserDetails;
import AS_API.config.TokenProvider;
import AS_API.dto.LoginRequestDto;
import AS_API.dto.LoginResponseDto;
import AS_API.entity.BlackList;
import AS_API.exception.CustomException;
import AS_API.repository.BlackListRepository;
import AS_API.repository.UserRepository;
import AS_API.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;


import static AS_API.exception.ErrorCode.*;




@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final BlackListRepository blackListRepository;

    public LoginResponseDto login(LoginRequestDto loginRequestDto){
        User user = userRepository.findByUid(loginRequestDto.getUid());
        if(user == null){
            throw new CustomException(USER_NOT_FOUND);
        }

        if(!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())){
            throw new CustomException(LOGIN_INFO_INVALID);
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, loginRequestDto.getPassword(), userDetails.getAuthorities()
        );


        String token = tokenProvider.generateAccessToken(authentication);

        return LoginResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .uid(user.getUid())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .role(user.getRole())
                .nickName(user.getNickName())
                .accessToken(token)
                .build();
    }

    public void logout(String accessToken, String studentNumber) {

        if (accessToken == null || !tokenProvider.validateToken(accessToken)) {
            throw new CustomException(INVALID_TOKEN);
        }

        Claims claims = tokenProvider.parseClaims(accessToken);
        long expiration = claims.getExpiration().getTime() - System.currentTimeMillis();

        blackListRepository.save(new BlackList(studentNumber, accessToken, expiration));
    }

}
