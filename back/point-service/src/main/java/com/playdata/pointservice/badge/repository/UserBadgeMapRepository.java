package com.playdata.pointservice.badge.repository;

import com.playdata.pointservice.badge.entity.UserBadgeMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserBadgeMapRepository extends JpaRepository<UserBadgeMap, Long> {
    // 유저가 받은 배지 중 1개 조회 (가장 빠른 생성 순으로 1개)
    UserBadgeMap findFirstByUserId(Long userId);
    // 유저가 받은 모든 배지 조회
    List<UserBadgeMap> findAllByUserId(Long userId);
}
