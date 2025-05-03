package AS_API.controller;

import AS_API.config.TokenProvider;
import AS_API.dto.LoginRequestDto;
import AS_API.dto.LoginResponseDto;
import AS_API.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final TokenProvider tokenProvider;

    @PostMapping("/api/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequestDto loginRequestDto) {

        LoginResponseDto loginResponseDto = authService.login(loginRequestDto);
        return ResponseEntity.ok(loginResponseDto);
    }

    @PostMapping("/api/logout")
    public ResponseEntity<Object> logout(HttpServletRequest request) {
        UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String studentNumber = principal.getUsername();
        String accessToken = tokenProvider.resolveTokenInHeader(request);
        authService.logout(accessToken, studentNumber);
        SecurityContextHolder.clearContext();

        Map<String, String> response = new HashMap<>();
        response.put("message", "로그아웃 되었습니다.");

        return ResponseEntity.ok(response);
    }
}
