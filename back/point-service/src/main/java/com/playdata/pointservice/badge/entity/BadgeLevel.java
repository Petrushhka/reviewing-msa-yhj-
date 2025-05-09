package com.playdata.pointservice.badge.entity;

import lombok.Getter;

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
        BadgeLevel result = BEGINNER;

        for (BadgeLevel level : values()) {
            if (point >= level.getMinPoint()) {
                result = level;
            }
        }
        return result;
    }
}
