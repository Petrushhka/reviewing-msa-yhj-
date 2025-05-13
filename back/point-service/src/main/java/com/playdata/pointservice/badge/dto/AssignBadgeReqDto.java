package com.playdata.pointservice.badge.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class AssignBadgeReqDto {
    // 클라이언트로부터 전달받는 배지 부여 요청 정보
    // 배지를 받을 유저 ID
    private Long userId;

    // 유저의 현재 포인트
    private int point;

    private String role;
}
