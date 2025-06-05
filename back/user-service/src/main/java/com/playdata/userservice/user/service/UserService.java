package com.playdata.userservice.user.service;


import com.playdata.userservice.common.auth.TokenUserInfo;
import com.playdata.userservice.user.dto.*;
import com.playdata.userservice.user.dto.*;
import com.playdata.userservice.common.config.AwsS3Config;
import com.playdata.userservice.user.entity.User;
import com.playdata.userservice.user.external.client.BadgeClient;
import com.playdata.userservice.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AwsS3Config awsS3Config;
    private final BadgeClient badgeClient;
    private final MailSenderService mailSenderService;


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


    // 유저 ID로 포인트 조회
    @Transactional(readOnly = true)
    public int getUserPoint(Long userId) {
        log.info("[UserService] getUserPoint() 호출됨 - userId: {}", userId);

        // 유저 ID로 DB에서 유저 찾기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("해당 ID의 유저 없음: {} ", userId);
                    return new IllegalArgumentException("유저 없음");
                });

        log.info("찾은 유저 포인트: {}", user.getPoint());
        // 유저 엔티티에서 포인트 리턴
        return user.getPoint();
    }


    public String uploadProfile(UserRequestDto userRequestDto) throws Exception {
        User user = userRepository.findById(userRequestDto.getId()).orElseThrow(
                () -> new EntityNotFoundException("User not found!")
        );


        // 1) 이전 프로필이 기본 url이 아니고, null도 아니라면 삭제
        String oldUrl = user.getProfileImage();
        if (oldUrl != null && !oldUrl.isBlank()) {
            awsS3Config.deleteFromS3Bucket(oldUrl);

        }

        //2) 새 파일 업로드
        MultipartFile profileImage = userRequestDto.getProfileImage();
        String uniqueFileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
        String imageUrl = awsS3Config.uploadToS3Bucket(profileImage.getBytes(), uniqueFileName);


        user.setProfileImage(imageUrl);
        userRepository.save(user);
        return imageUrl;
    }

    public UserResDto findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }
        return user.toDto();
    }

    public UserResDto addPoint(Long userId, Integer point) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new EntityNotFoundException("User not found!")
        );
        if (user == null) {
            return null;
        }

        user.setPoint(user.getPoint()+point);
        userRepository.save(user);
        return user.toDto();
    }

    public UserUpdateDto updateInfoUser(UserUpdateDto dto) {
        User user = userRepository.findById(dto.getId()).orElseThrow(
                () -> new EntityNotFoundException("User not found!")
        );

        String newNick = dto.getNickName();
        if (dto.getNickName() != null && !dto.getNickName().isBlank()) {
            if(!newNick.equals(user.getNickName())&& userRepository.existsByNickName(newNick)) {
                throw new IllegalArgumentException("이미 사용중인 닉네임 입니다.");
            }
            user.setNickName(newNick);
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            String encodedPassword = encoder.encode(dto.getPassword());
            user.setPassword(encodedPassword);
        }
        userRepository.save(user);

        return UserUpdateDto.builder()
                .id(user.getId())
                .nickName(user.getNickName())
                .build();
    }

    public UserResDto getUserProfile(String userId) {

        User user = userRepository.findById(Long.parseLong(userId)).orElseThrow(
                () -> new EntityNotFoundException("User not found!")
        );

        return UserResDto.builder()
                .profileImage(user.getProfileImage())
                .build();
    }

    public String mailCheck(String email) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
        }

        String authNum;

        try {
            // 이메일 전송만을 담당하는 객체를 이용해서 이메일 로직 작성.
            authNum = mailSenderService.joinMail(email);
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 과정 중 문제 발생!");
        }

        return authNum;

    }

    public String addBlackUser(String email, Boolean black) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isEmpty()) {
            throw new EntityNotFoundException("해당 회원이 없습니다.");
        }

        User user = userOptional.get();

        if (user.getIsBlack()) {
            user.setIsBlack(false);
        }
        else{
            user.setIsBlack(true);
        }
        userRepository.save(user);
        return user.getNickName();
    }

    public List<UserResDto> findAll() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user->user.toDto())
                .collect(Collectors.toList());

    }
}





