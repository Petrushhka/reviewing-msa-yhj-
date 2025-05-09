package com.playdata.pointservice.badge.controller;

import com.playdata.pointservice.badge.dto.AssignBadgeReqDto;
import com.playdata.pointservice.badge.dto.UserBadgeResDto;
import com.playdata.pointservice.badge.entity.UserBadgeMap;
import com.playdata.pointservice.badge.service.BadgeService;
import com.playdata.pointservice.common.dto.CommonResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



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

    // FeignClient 전용 Api
    @GetMapping("/user/{userId}")
    public UserBadgeResDto getUserBadgeByUserId(@PathVariable Long userId) {
        log.info("Feign용 유저 배지 조회: {}", userId);
        return badgeService.getUserBadgeByUserId(userId); //이 메서드는 UserBadgeResDto를 반환
    }


    /**
     * 프론트에서 사용할 '배지 진행 상황' API
     */
    @GetMapping("/user/{userId}/progress")
    public ResponseEntity<CommonResDto> getBadgeProgress(@PathVariable Long userId) {
        log.info("배지 진행 상태 조회: {}", userId);
        CommonResDto resDto = badgeService.getBadgeProgress(userId); // 서비스 로직 호출
        return ResponseEntity.status(resDto.getStatusCode()).body(resDto);

    }





}
