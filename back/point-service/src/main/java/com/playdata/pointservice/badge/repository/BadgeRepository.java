package com.playdata.pointservice.badge.repository;

import com.playdata.pointservice.badge.entity.Badge;
import com.playdata.pointservice.badge.entity.BadgeLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface BadgeRepository extends JpaRepository<Badge, Long> {

    // 레벨별 최신 배지 1개 조회
    Badge findTopByLevelOrderByIdDesc(BadgeLevel level);

    Optional<Badge> findByLevel(BadgeLevel level);
}
