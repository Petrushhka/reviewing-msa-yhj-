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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeMapRepository mapRepository;
    private final UserPointClient userPointClient;

    /**
     * 유저에게 포인트 기준으로 적절한 배지를 부여합니다.
     */
    @Transactional
    public CommonResDto assignBadge(AssignBadgeReqDto request) {
        int point = request.getPoint();
        Long userId = request.getUserId();
        String role = request.getRole();


        try {
            log.info("assignBadge 요청: userId={}, point={}", userId, point);
            
            // 운영자일 경우 운영자 배지를 부여
            if ("ADMIN".equalsIgnoreCase(role)) {
                Badge adminBadge = badgeRepository.findByName("운영자")
                        .orElseThrow(() -> new NoSuchElementException("운영자 배지를 찾을 수 없습니다"));

                mapRepository.deleteByUserId(userId);

                UserBadgeMap map = new UserBadgeMap(userId, adminBadge);
                mapRepository.save(map);
                log.info("운영자 배지 부여 완료");

                UserBadgeResDto resDto = UserBadgeResDto.builder()
                        .badgeName(adminBadge.getName())
                        .description(adminBadge.getDescription())
                        .iconUrl(adminBadge.getIcon_url())
                        .level("ADMIN")
                        .build();

                return new CommonResDto(HttpStatus.OK, "운영자 배지 부여 성공", resDto);
            }
            
            
            // 일반 유저는 기존 포인트 기준 부여 로직 수행
            BadgeLevel level = BadgeLevel.fromPoint(point);
            log.info("계산된 level: {}", level);

            Badge badge = badgeRepository.findTopByLevelOrderByIdDesc(level);
            if (badge == null) {
                log.warn("해당 레벨의 배지를 찾을 수 없습니다: {}", level);
                return new CommonResDto(HttpStatus.NOT_FOUND, "해당 레벨의 배지를 찾을 수 없습니다.", null);
            }
            // 기존 배지 삭제
            mapRepository.deleteByUserId(userId);



            UserBadgeMap map = new UserBadgeMap(userId, badge);
            mapRepository.save(map);
            log.info("배지 저장 완료: userId={}, badge={}", userId, badge.getName());

            UserBadgeResDto resDto = UserBadgeResDto.builder()
                    .badgeName(badge.getName())
                    .description(badge.getDescription())
                    .iconUrl(badge.getIcon_url())
                    .level(badge.getLevel().name())
                    .build();
            log.info(">>> [assignBadge] role = {}", role);
            log.info(">>> 전달된 role = '{}'", request.getRole());

            return new CommonResDto(HttpStatus.OK, "배지 부여 성공", resDto);

        } catch (Exception e) {
            log.error(" 배지 부여 중 예외 발생", e);
            return new CommonResDto(HttpStatus.INTERNAL_SERVER_ERROR, "배지 부여 실패", null);
        }
    }


    public CommonResDto getUserBadge(Long userId) {
        UserBadgeMap map = mapRepository.findTopByUserIdOrderByBadgeLevelDesc(userId);
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
        UserBadgeMap badgeMap = mapRepository.findTopByUserIdOrderByBadgeLevelDesc(userId);
        if (badgeMap == null) {
            throw new NoSuchElementException("해당 유저에게 배지가 부여되지 않았습니다.");
        }
        Badge badge = badgeMap.getBadge();
        return UserBadgeResDto.builder()
                .badgeName(badge.getName())
                .level(badge.getLevel().name())
                .iconUrl(badge.getIcon_url())
                .build();
    }

    public CommonResDto getBadgeProgress(Long userId) {
        try {
            int point = Optional.ofNullable(userPointClient.getUserPoint(userId)).orElse(0);
            log.info("사용자 포인트: {}", point);

            List<Badge> allBadges = badgeRepository.findAll();
            if (allBadges.isEmpty()) {
                return new CommonResDto(HttpStatus.NOT_FOUND, "등록된 배지가 없습니다", null);
            }

            allBadges.sort(Comparator.comparing(Badge::getThreshold));

            Badge current = null;
            Badge next = null;

            for (Badge badge : allBadges) {
                if (point >= badge.getThreshold()) {
                    current = badge;
                } else {
                    next = badge;
                    break;
                }
            }

            BadgeLevel currentLevel = current != null ? current.getLevel() : BadgeLevel.BEGINNER;
            String nextLevelName;
            int pointsToNextLevel;

            // 마스터가 아니고 다음 티어가 존재하면 → 남은 포인트 계산
            if (currentLevel != BadgeLevel.MASTER && next != null) {
                nextLevelName = next.getLevel().getDisplayName();
                pointsToNextLevel = next.getThreshold() - point;
            } else {
                // 마스터거나 next가 없는 경우 → 최고레벨 처리
                nextLevelName = "MAX";
                pointsToNextLevel = 0;
            }

            BadgeProgressResDto resDto = BadgeProgressResDto.builder()
                    .currentPoint(point)
                    .currentLevel(currentLevel.getDisplayName())
                    .nextLevel(nextLevelName)
                    .pointsToNextLevel(pointsToNextLevel)
                    .build();

            return new CommonResDto(HttpStatus.OK, "진행 상태 조회 성공", resDto);
        } catch (Exception e) {
            log.error("진행 상태 조회 실패", e);
            return new CommonResDto(HttpStatus.INTERNAL_SERVER_ERROR, "오류 발생", null);
        }
    }

}
