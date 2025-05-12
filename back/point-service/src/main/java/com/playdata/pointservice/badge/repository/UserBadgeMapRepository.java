package com.playdata.pointservice.badge.repository;

import com.playdata.pointservice.badge.entity.Badge;
import com.playdata.pointservice.badge.entity.BadgeLevel;
import com.playdata.pointservice.badge.entity.UserBadgeMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserBadgeMapRepository extends JpaRepository<UserBadgeMap, Long> {

    UserBadgeMap findTopByUserIdOrderByBadgeLevelDesc(Long userId);


    void deleteByUserId(Long userId);
}
