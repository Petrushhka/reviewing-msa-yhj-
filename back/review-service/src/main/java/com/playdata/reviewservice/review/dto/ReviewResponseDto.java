package com.playdata.reviewservice.review.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.playdata.reviewservice.review.entity.Review;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ReviewResponseDto {
    private Long id;
    private Long userId;
    private String nickname;
    private String content;
    private String rating;
    private UserBadgeResDto badgeInfo;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @Builder.Default
    private List<String> images = new ArrayList<>();
}
