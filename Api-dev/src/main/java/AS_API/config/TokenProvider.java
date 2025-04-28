package AS_API.config;

import AS_API.exception.CustomException;
import AS_API.repository.BlackListRepository;
import AS_API.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import AS_API.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static AS_API.config.TokenValue.ACCESS_HEADER;
import static AS_API.exception.ErrorCode.*;

@Component
@RequiredArgsConstructor
public class TokenProvider {

    @Value("${jwt.secret.key}")
    private String key;
    private SecretKey secretKey;
    private final UserRepository userRepository;
    private final BlackListRepository blackListRepository;

    @PostConstruct
    private void setSecretKey() {
        secretKey = Keys.hmacShaKeyFor(key.getBytes());
    }

    public String generateAccessToken(Authentication authentication) {
        return generateToken(authentication, TokenValue.ACCESS_TTL, ACCESS_HEADER);
    }

    private String generateToken(Authentication authentication, long expireTime, String tokenType) {
        Date now = new Date();
        Date expiredDate = new Date(now.getTime() + expireTime);

        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining());

        String uniqueId = UUID.randomUUID().toString();

        return Jwts.builder()
                .setSubject(tokenType)  // 'subject()' → 'setSubject()'
                .claim("uid", authentication.getName())
                .claim("role", authorities)
                .claim("uniqueId", uniqueId)
                .setIssuedAt(now)
                .setExpiration(expiredDate)
                .signWith(secretKey, io.jsonwebtoken.SignatureAlgorithm.HS512) // FIX: 'SIG' → 'SignatureAlgorithm'
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);
        List<SimpleGrantedAuthority> authorities = getAuthorities(claims);
        User user = userRepository.findByUid(claims.get("uid").toString());
        CustomUserDetails principal = new CustomUserDetails(user);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    private List<SimpleGrantedAuthority> getAuthorities(Claims claims) {
        return Collections.singletonList(new SimpleGrantedAuthority(
                claims.get("role").toString()));
    }

    public boolean validateToken(String token) {
        if (StringUtils.hasText(token)) {
            parseClaims(token);

            if (blackListRepository.existsByAccessToken(token)) {
                throw new CustomException(EXIST_ACCESSTOKEN_BLACKLIST);
            }
            return true;
        }
        return false;
    }

    public Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey) // FIX: 'verifyWith()' → 'setSigningKey()'
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new CustomException(TOKEN_EXPIRED);
        } catch (MalformedJwtException e) {
            throw new CustomException(INVALID_TOKEN);
        } catch (SecurityException e) {
            throw new CustomException(INVALID_SIGNATURE);
        }
    }

    public String resolveTokenInHeader(HttpServletRequest request) {
        String token = request.getHeader(ACCESS_HEADER);
        if (ObjectUtils.isEmpty(token) || !token.startsWith(TokenValue.TOKEN_PREFIX)) {
            return null;
        }
        return token.substring(TokenValue.TOKEN_PREFIX.length());
    }
}
