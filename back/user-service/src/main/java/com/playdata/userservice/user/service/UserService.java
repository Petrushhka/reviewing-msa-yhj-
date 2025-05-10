package com.playdata.userservice.user.service;


import com.playdata.userservice.common.auth.TokenUserInfo;
import com.playdata.userservice.user.dto.UserLoginReqDto;
import com.playdata.userservice.common.config.AwsS3Config;
import com.playdata.userservice.user.dto.UserRequestDto;
import com.playdata.userservice.user.dto.UserResDto;
import com.playdata.userservice.user.dto.UserSaveReqDto;
import com.playdata.userservice.user.entity.User;
import com.playdata.userservice.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AwsS3Config awsS3Config;


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

        log.info("🔍 로그인된 사용자: id={}, email={}, nickName={}",
                user.getId(), user.getEmail(), user.getNickName());

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


    public void uploadProfile(UserRequestDto userRequestDto) throws Exception {
        User user = userRepository.findById(userRequestDto.getId()).orElseThrow(
                () -> new EntityNotFoundException("User not found!")
        );


        // 1) 이전 프로필이 기본 url이 아니고, null도 아니라면 삭제
        String oldUrl = user.getProfileImage();
        if (oldUrl != null && !oldUrl.isBlank()) {
            awsS3Config.deleteFromS3Bucket(oldUrl);
            ;
        }

        //2) 새 파일 업로드
        MultipartFile profileImage = userRequestDto.getProfileImage();
        String uniqueFileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
        String imageUrl = awsS3Config.uploadToS3Bucket(profileImage.getBytes(), uniqueFileName);


        user.setProfileImage(imageUrl);
        userRepository.save(user);
    }
}





