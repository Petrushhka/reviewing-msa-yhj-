package com.playdata.reviewservice.review.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserBadgeResDto {
    // 클라이언트에 응답할 배지 정보 DTO
    private String badgeName;
    private String description;
    private String iconUrl;
    private String level; // 배지 레벨 문자열
}
