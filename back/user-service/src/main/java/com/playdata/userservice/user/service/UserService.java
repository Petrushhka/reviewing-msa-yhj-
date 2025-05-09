package com.playdata.userservice.user.service;

import com.playdata.userservice.common.auth.TokenUserInfo;
import com.playdata.userservice.user.dto.UserLoginReqDto;
import com.playdata.userservice.user.dto.UserResDto;
import com.playdata.userservice.user.dto.UserSaveReqDto;
import com.playdata.userservice.user.entity.User;
import com.playdata.userservice.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserResDto createUser(UserSaveReqDto dto) {
        Optional<User> foundEmail
                = userRepository.findByEmail(dto.getEmail());

        if (foundEmail.isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일 입니다!");
        }

        User user = dto.toEntity(encoder);
        User saved = userRepository.save(user);
        return saved.toDto();
    }

    public UserResDto login(UserLoginReqDto dto) {
        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow(
                () -> new EntityNotFoundException("User not found!")
        );

        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return user.toDto();
    }

    public User findById(String id) {
        return userRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException("User not found!")
        );
    }
    
    
    // 임시 작성
    public int getUserPoint(Long userId) {
        return 5;
    }
}
