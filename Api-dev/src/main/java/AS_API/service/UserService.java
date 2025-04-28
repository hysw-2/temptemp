package AS_API.service;

import AS_API.dto.UserProfileUpdateDto;
import AS_API.dto.UserResponseDto;
import AS_API.exception.CustomException;
import AS_API.exception.ErrorCode;
import AS_API.repository.UserRepository;
import AS_API.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(User user){
        validateDuplicateUser(user);
        userRepository.save(user);
    }

    private void validateDuplicateUser(User user) {
        User findUser = userRepository.findByUid(user.getUid());
        if (findUser != null) {
            throw new CustomException(ErrorCode.USER_ALREADY_EXIST);
        }
    }


    public User findUserByUid(String uid) {
        User user = userRepository.findByUid(uid);
        if (user == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    public void deleteUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            userRepository.deleteById(userId);
        } else {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
    }

    public Page<UserResponseDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(UserResponseDto::fromSimple);
    }


    public UserResponseDto getUserDetailById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return new UserResponseDto(user);
    }

    public void updateUserProfile(Long userId, UserProfileUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 현재 비밀번호 확인
        if (dto.getCurrentPassword() == null || !passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.USER_PASSWORD_MISMATCH);
        }

        boolean changed = false;

        // 새 비밀번호 변경
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            String encoded = passwordEncoder.encode(dto.getNewPassword());
            user.updatePassword(encoded);
            changed = true;
        }

        // 닉네임 변경
        if (dto.getNewNickName() != null && !dto.getNewNickName().isBlank()) {
            user.updateNickName(dto.getNewNickName());
            changed = true;
        }

        if (!changed) {
            throw new CustomException(ErrorCode.NO_UPDATE_FIELD);
        }

        userRepository.save(user);
    }
}
