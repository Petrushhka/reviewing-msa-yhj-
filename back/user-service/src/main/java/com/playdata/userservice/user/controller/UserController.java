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
import jakarta.validation.Valid;
import jakarta.ws.rs.HEAD;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public ResponseEntity<?> uploadProfile(
            UserRequestDto dto) throws Exception {
        userService.uploadProfile(dto);
        CommonResDto resDto
                = new CommonResDto(HttpStatus.OK,
                "upload success", null);

        return new ResponseEntity<>(resDto, HttpStatus.OK);
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



        CommonResDto resDto
                = new CommonResDto(HttpStatus.OK,
                "Login Success", loginInfo);
        return new ResponseEntity<>(resDto, HttpStatus.OK);
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
        int point = userService.getUserPoint(userId);
        return ResponseEntity.ok(point);
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



}
