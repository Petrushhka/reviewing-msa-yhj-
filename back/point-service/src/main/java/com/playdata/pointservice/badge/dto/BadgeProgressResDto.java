package com.playdata.pointservice.badge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class BadgeProgressResDto {
    private int currentPoint;         // 현재 유저 포인트
    private String currentLevel;      // 현재 티어 이름
    private String nextLevel;         // 다음 티어 이름
    private int pointsToNextLevel;    // 다음까지 남은 포인트
}
