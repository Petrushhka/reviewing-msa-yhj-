package com.playdata.pointservice.badge.controller;

import com.playdata.pointservice.badge.dto.AssignBadgeReqDto;
import com.playdata.pointservice.badge.dto.UserBadgeResDto;
import com.playdata.pointservice.badge.entity.UserBadgeMap;
import com.playdata.pointservice.badge.service.BadgeService;
import com.playdata.pointservice.common.dto.CommonResDto;
import jakarta.ws.rs.GET;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;

@RestController
@RequestMapping("/badges")
@RequiredArgsConstructor
@Slf4j
public class BadgeController {

    // BadgeService 의존성 주입
    private final BadgeService badgeService;


     // [POST] /badges
     // 클라이언트가 유저 ID와 포인트를 보내면, 해당 포인트 기준으로 뱃지를 부여
    @PostMapping("/assign")
    public ResponseEntity<CommonResDto> assignBadge(@RequestBody AssignBadgeReqDto request) {
        log.info("배지 부여 요청: {}", request);
        CommonResDto resDto = badgeService.assignBadge(request);
        // 상태 코드의 따라서 응답 반환
        return ResponseEntity.status(resDto.getStatusCode()).body(resDto);
    }

    // [GET] /badges/{userId}
    // 해당 유저에게 가장 최근에 부여된 배지를 조회
    @GetMapping("/{userId}")
    public ResponseEntity<CommonResDto> getUserBadge(@PathVariable Long userId) {
        log.info("유저 배지 조회: {}", userId);
        CommonResDto resDto = badgeService.getUserBadge(userId);
        return ResponseEntity.status(resDto.getStatusCode()).body(resDto);
    }

    // [GET] /badges/user/{userId}/Icon
    // 댓글 등 사용자 이름 옆에 표시할 배지 아이콘 정보 제공
    // 배지명 + 아이콘 URL 포함
    @GetMapping("/user/{userId}/icon")
    public ResponseEntity<CommonResDto> getUserBadgeIcon(@PathVariable Long userId) {
        log.info("유저 배지 아이콘 조회: {}", userId);
        CommonResDto resDto = badgeService.getUserBadgeIcon(userId);
        return ResponseEntity.status(resDto.getStatusCode()).body(resDto);
    }


}
