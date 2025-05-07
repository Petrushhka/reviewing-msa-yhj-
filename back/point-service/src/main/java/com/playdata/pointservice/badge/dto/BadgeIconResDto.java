package com.playdata.pointservice.badge.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BadgeIconResDto {
    private String badgeName;
    private String iconUrl;
}
