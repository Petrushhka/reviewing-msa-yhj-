package com.playdata.pointservice.badge.service;


import com.playdata.pointservice.badge.dto.AssignBadgeReqDto;
import com.playdata.pointservice.badge.dto.BadgeProgressResDto;
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

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Slf4j
@Builder
@Service
@RequiredArgsConstructor
public class BadgeService {


    private final BadgeRepository badgeRepository; // 배지 테이블 접근
    private final UserBadgeMapRepository mapRepository; // 유저-배지 매핑 테이블 접근
    private final UserPointClient userPointClient; // 유저의 포인트를 조회하기 위한 Feign Client (User 서비스 호출용)


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


    /**
     * 유저의 현재 포인트를 기반으로 현재 레벨과 다음 레벨까지 남은 점수를 계산하여 응답
     */
    public CommonResDto getBadgeProgress(Long userId) {
        try {



            // 유저 서비스에 요청하여 포인트를 받아옴
//            int point = Optional.ofNullable(userPointClient.getUserPoint(userId)).orElse(0);
            int point = 120;
            log.info("사용자 포인트: {}", point);

            // 현재 서비스는 '리뷰' 작성에만 포인트 부여
            List<Badge> allBadges = badgeRepository.findAll();
            log.info("전체 배지 개수: {}", allBadges.size());

            // 포인트 기준으로 오름차순 정렬 (낮은 점수 배지부터)
            allBadges.sort(Comparator.comparing(Badge::getThreshold));
            log.info("정렬 후 첫 배지: {}", allBadges.get(0));

            Badge current = null;
            Badge next = null;

            // 현재 포인트로 현재티어 / 다음 티어 판단
            for (Badge badge : allBadges) {
                if (point >= badge.getThreshold()) {
                    current = badge;
                } else {
                    next = badge;
                    break;
                }
            }

            // DTO로 포장해서 반환
            BadgeProgressResDto resDto = BadgeProgressResDto.builder()
                    .currentPoint(point)
                    .currentLevel(current != null ? current.getLevel().name() : "BEGINNER")
                    .nextLevel(next != null ? next.getLevel().name() : "MAX")
                    .pointsToNextLevel(next != null ? next.getThreshold() - point : 0)
                    .build();

            return new CommonResDto(HttpStatus.OK, "진행 상태 조회 성공", resDto);
        } catch (Exception e) {
            log.error("진행 상태 조회 실패", e);
           return new CommonResDto(HttpStatus.INTERNAL_SERVER_ERROR, "오류 발생", null);
        }
    }
}
