package com.playdata.pointservice.badge.service;


import com.playdata.pointservice.badge.dto.AssignBadgeReqDto;
import com.playdata.pointservice.badge.dto.UserBadgeResDto;
import com.playdata.pointservice.badge.entity.Badge;
import com.playdata.pointservice.badge.entity.BadgeLevel;
import com.playdata.pointservice.badge.entity.UserBadgeMap;
import com.playdata.pointservice.badge.external.client.UserPointClient;
import com.playdata.pointservice.badge.repository.BadgeRepository;
import com.playdata.pointservice.badge.repository.UserBadgeMapRepository;
import com.playdata.pointservice.common.dto.CommonResDto;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Builder
@Service
@RequiredArgsConstructor
public class BadgeService {


    private final BadgeRepository badgeRepository; // 배지 테이블 접근
    private final UserBadgeMapRepository mapRepository; // 유저-배지 매핑 테이블 접근
    private final UserPointClient userPointClient;


    /**
     * 유저에게 포인트 기준으로 적절한 배지를 부여합니다.
     *
     * @param request 유저 ID와 포인트 정보가 담긴 요청 DTO
     * @return 배지 부여 결과를 담은 공통 응답 객체
     */

    @Transactional
    // 배지 부여 처리 로직
    public CommonResDto assignBadge(AssignBadgeReqDto request) {
        int point = request.getPoint(); // 현재 유저 포인트
        Long userId = request.getUserId();

        // 포인트 기준으로 최신 배지를 계산
        BadgeLevel level = BadgeLevel.fromPoint(point);

        // 해당 레벨의 최신 배지를 조회 (ID 기준으로 가장 최근)
        Badge badge = badgeRepository.findTopByLevelOrderByIdDesc(level);
        if (badge == null) {
            return new CommonResDto(HttpStatus.NOT_FOUND, "해당 레벨의 메세지를 찾을 수 없습니다.", null);
        }

        // 배지와 유저 ID로 매핑 객체 생성 및 저장
        UserBadgeMap map = new UserBadgeMap(request.getUserId(), badge);
        mapRepository.save(map);

        // 클라이언트에게 응답할 DTO 생성
        UserBadgeResDto resDto = UserBadgeResDto.builder()
                .badgeName(badge.getName())
                .description(badge.getDescription())
                .iconUrl(badge.getIcon_url())
                .level(badge.getLevel().name())
                .build();
        return new CommonResDto(HttpStatus.OK, "배지 부여 성공", resDto);
    }

    // 유저 ID로 배지 조회
    public CommonResDto getUserBadge(Long userId) {
        // 유저가 가진 배지 중 아무거나 1개 (정렬 기준 없음)
        UserBadgeMap map = mapRepository.findFirstByUserId(userId);
        if (map == null) {
            return new CommonResDto(HttpStatus.NOT_FOUND, "사용자에게 배지가 없습니다.", null);
        }

        Badge badge = map.getBadge();

        UserBadgeResDto resDto = UserBadgeResDto.builder()
                .badgeName(badge.getName())
                .description(badge.getDescription())
                .iconUrl(badge.getIcon_url())
                .level(badge.getLevel().name())
                .build();
        return new CommonResDto(HttpStatus.OK, "사용자 배지 조회 성공", resDto);
    }

    public UserBadgeResDto getUserBadgeByUserId(Long userId) {
        try {
            UserBadgeMap badgeMap = mapRepository.findTopByUserIdOrderByBadgeLevelDesc(userId);

            Badge badge;
            if (badgeMap != null) {
                badge = badgeMap.getBadge();
            } else {
                // 포인트로 계산하거나, BEFINNER 로 fallback
                int point = userPointClient.getUserPoint(userId);
                BadgeLevel level = BadgeLevel.fromPoint(point);
                badge = badgeRepository.findTopByLevelOrderByIdDesc(level);

                if (badge == null) {
                    return UserBadgeResDto.builder()
                            .badgeName("입문자")
                            .level("BEGINNER")
                            .build();
                }
            }
            return UserBadgeResDto.builder()
                    .badgeName(badge.getName())
                    .level(badge.getLevel().name())
                    .build();


        } catch (Exception e) {
            log.error("배지 조회 실패", e);
            return UserBadgeResDto.builder()
                    .badgeName("입문자")
                    .level("BEGINNER")
                    .build();

        }

    }


}
