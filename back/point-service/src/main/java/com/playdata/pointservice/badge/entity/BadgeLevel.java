package com.playdata.pointservice.badge.entity;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.Comparator;

@Slf4j
@Getter
public enum BadgeLevel {
    BEGINNER(0, "입문자"),
    INTERMEDIATE(100, "리뷰 중수"),
    ADVANCED(200, "리뷰 고수"),
    MASTER(300, "맛집 마스터");

    private final int minPoint;
    private final String displayName;


    BadgeLevel(int minPoint, String displayName) {
        this.minPoint = minPoint;
        this.displayName = displayName;
    }

    public static BadgeLevel fromPoint(int point) {
        return Arrays.stream(values())
                .sorted(Comparator.comparingInt(BadgeLevel::getMinPoint).reversed())
                .filter(level -> point >= level.getMinPoint())
                .findFirst()
                .orElse(BEGINNER);
    }

}
