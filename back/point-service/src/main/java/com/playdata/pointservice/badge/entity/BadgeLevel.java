package com.playdata.pointservice.badge.entity;

import lombok.Getter;

@Getter
public enum BadgeLevel {
    BEGINNER(0, "입문자", "/icons/badge/beginner.png"),
    INTERMEDIATE(100, "리뷰 중수", "/icons/badge/intermediate.png"),
    ADVANCED(200, "리뷰 고수", "/icons/badge/advanced.png"),
    MASTER(300, "맛집 마스터", "/icons/badge/master.png");

    private final int minPoint;
    private final String displayName;
    private final String iconUrl;

    BadgeLevel(int minPoint, String displayName, String iconUrl) {
        this.minPoint = minPoint;
        this.displayName = displayName;
        this.iconUrl = iconUrl;
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
