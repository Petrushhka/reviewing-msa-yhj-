package com.playdata.reviewservice.review.dto;

import com.playdata.reviewservice.review.entity.Review;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ReviewResponseDto {
    private Long id;
    private String nickname;
    private String content;
    private String rating;

    @Builder.Default
    private List<String> images = new ArrayList<>();
}
