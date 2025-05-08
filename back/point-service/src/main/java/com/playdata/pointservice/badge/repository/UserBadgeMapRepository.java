package com.playdata.pointservice.badge.repository;

import com.playdata.pointservice.badge.entity.Badge;
import com.playdata.pointservice.badge.entity.BadgeLevel;
import com.playdata.pointservice.badge.entity.UserBadgeMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserBadgeMapRepository extends JpaRepository<UserBadgeMap, Long> {
    // 유저가 받은 배지 중 1개 조회 (가장 빠른 생성 순으로 1개)
    UserBadgeMap findFirstByUserId(Long userId);

    UserBadgeMap findTopByUserIdOrderByBadgeLevelDesc(Long userId);


}
