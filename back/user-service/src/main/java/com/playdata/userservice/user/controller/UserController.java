package com.playdata.userservice.user.controller;
import com.playdata.userservice.common.auth.JwtTokenProvider;
import com.playdata.userservice.common.dto.CommonErrorDto;
import com.playdata.userservice.common.dto.CommonResDto;
import com.playdata.userservice.user.dto.UserBadgeResDto;
import com.playdata.userservice.user.dto.UserLoginReqDto;
import com.playdata.userservice.user.dto.UserResDto;
import com.playdata.userservice.user.dto.UserSaveReqDto;
import com.playdata.userservice.user.entity.User;
import com.playdata.userservice.user.external.client.BadgeClient;
import com.playdata.userservice.user.dto.*;
import com.playdata.userservice.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.ws.rs.HEAD;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/user-service")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, Object> redisTemplate;
    private final BadgeClient badgeClient;

    private final Environment env;

    @PostMapping("/users/signup")
    public ResponseEntity<?> createUser(
            @Valid @RequestBody UserSaveReqDto dto) {
        UserResDto saved = userService.createUser(dto);
        CommonResDto resDto
                = new CommonResDto(HttpStatus.CREATED,
                "User Created", saved.getNickName());

        return new ResponseEntity<>(resDto, HttpStatus.CREATED);
    }

    @PostMapping("/user/profile")
    public ResponseEntity<?> uploadProfile(@ModelAttribute UserRequestDto dto) throws Exception {
        String newProfile = userService.uploadProfile(dto);
        CommonResDto resDto
                = new CommonResDto(HttpStatus.OK,
                "upload success", Map.of("newProfileName", newProfile));

        return new ResponseEntity<>(resDto, HttpStatus.OK);
    }

    @PutMapping("/user/update-info")
        public ResponseEntity<?> updateUser(@Valid @RequestBody UserUpdateDto dto){
        try {
            UserUpdateDto updated = userService.updateInfoUser(dto);
            CommonResDto resDto = new CommonResDto(
                    HttpStatus.OK,
                    "회원정보 수정 성공",
                    updated
            );
            return ResponseEntity.ok(resDto);

        } catch (IllegalArgumentException e) {
            // 닉네임 중복 또는 비밀번호 조건 위반
            CommonResDto resDto = new CommonResDto(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );
            return new ResponseEntity<>(resDto, HttpStatus.BAD_REQUEST);
        } catch (EntityNotFoundException e) {
            CommonResDto resDto = new CommonResDto(
                    HttpStatus.NOT_FOUND,
                    e.getMessage(),
                    null
            );
            return new ResponseEntity<>(resDto, HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/user/login")
    public ResponseEntity<?> login(@RequestBody UserLoginReqDto dto) {
        UserResDto user = userService.login(dto);

        String token
                = jwtTokenProvider.createToken(user.getEmail(), user.getRole().toString());
        String refreshToken
                = jwtTokenProvider.createRefreshToken(user.getEmail(), user.getRole().toString());

        redisTemplate.opsForValue().set("user:refresh:" + user.getId(), refreshToken, 2, TimeUnit.MINUTES);


        // 여기서 FeignClient 호출
        UserBadgeResDto badge = null;
        try {
            badge = badgeClient.getUserBadge(user.getId()); // point-service 에 요청
            log.info("badgeClient 결과: {}", badge);
        } catch (Exception e) {
            log.warn("배지 없음 또는 조회 실패: {}", e.getMessage());
        }




        Map<String, Object> loginInfo = new HashMap<>();
        loginInfo.put("token", token);
        loginInfo.put("id", user.getId());
        loginInfo.put("nickName", user.getNickName());
        loginInfo.put("role", user.getRole().toString());
        loginInfo.put("badge", badge);
        loginInfo.put("profileImage", user.getProfileImage());



        CommonResDto resDto
                = new CommonResDto(HttpStatus.OK,
                "Login Success", loginInfo);
        return new ResponseEntity<>(resDto, HttpStatus.OK);
    }

    // 유효한 이메일인지 검증 요청
    @PostMapping("/email-valid")
    public ResponseEntity<?> emailValid(@RequestBody Map<String, String> map) {
        String email = map.get("email");
        log.info("이메일 인증 요청! email: {}", email);

        return null;
    }



    @GetMapping("user/profileImage/{userId}")
    public ResponseEntity<?> getUserProfileImage(@PathVariable("userId") String userId) {
        try {
            UserResDto user = userService.getUserProfile(userId);
            CommonResDto resDto = new CommonResDto(
                    HttpStatus.OK,
                    "프로필 전달 완료 ",
                    user);
            return new ResponseEntity<>(resDto, HttpStatus.OK);
        } catch (Exception e) {
            log.error("유저 못찾음", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "statusCode", 500,
                            "statusMessage", "server error",
                            "error", e.getMessage()
                    ));
        }
    }

    @PostMapping("user/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> map) {
        String id = map.get("id");
        log.info("/user/refresh: POST, id: {}", id);
        // redis에 해당 id로 조회되는 내용이 있는지 확인
        Object obj = redisTemplate.opsForValue().get("user:refresh:" + id);
        log.info("obj: {}", obj);
        if (obj == null) { // refresh token이 수명이 다됨.
            return new ResponseEntity<>(new CommonErrorDto(
                    HttpStatus.UNAUTHORIZED, "EXPIRED_RT"),
                    HttpStatus.UNAUTHORIZED);
        }
        // 새로운 access token을 발급
        User user = userService.findById(id);
        String newAccessToken
                = jwtTokenProvider.createToken(user.getEmail(), user.getRole().toString());

        Map<String, Object> info = new HashMap<>();
        info.put("token", newAccessToken);
        CommonResDto resDto
                = new CommonResDto(HttpStatus.OK, "새 토큰 발급됨", info);
        return ResponseEntity.ok().body(resDto);

    }

    @GetMapping("/user/{userId}/point")
    public ResponseEntity<?> getUserPoint(@PathVariable Long userId) {
        try {
            int point = userService.getUserPoint(userId);
            return ResponseEntity.ok(point);
        } catch (Exception e) {
            log.error("유저 포인트 조회 중 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "statusCode", 500,
                            "statusMessage", "server error",
                            "error", e.getMessage()
                    ));
        }
    }


    @PostMapping("/users")
    public ResponseEntity<?> getUserForReivew(@RequestBody List<Integer> userIds) {
        List<User> users = new ArrayList<>();
        for (int i = 0; i < userIds.size(); i++) {
            users.add(userService.findById(String.valueOf(userIds.get(i))));
        }

        users.stream()
                .map(user->UserResDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .nickName(user.getNickName())
                        .profileImage(user.getProfileImage())
                        .point(user.getPoint())
                        .build()).collect(Collectors.toList());

        return ResponseEntity.ok().body(users);

    }

    @GetMapping("/users")
    public ResponseEntity<UserResDto> getUserByEmail(@RequestParam String email) {
        UserResDto userResDto = userService.findByEmail(email);

        return ResponseEntity.ok().body(userResDto);
    }

    @PutMapping("/users/point")
    public ResponseEntity<UserResDto> updatePoint(@RequestParam Long userId, @RequestParam int point ){
        UserResDto userResDto = userService.addPoint(userId, point);
        return ResponseEntity.ok().body(userResDto);
    };

    @GetMapping("/health-check")
    public String healthCheck() {
        String msg = "";
        msg += "token.exp_time:" + env.getProperty("token.expiration_time") +"\n";
        return msg;
    }


}
