package com.playdata.reviewservice.review.controller;

import com.playdata.reviewservice.common.auth.TokenUserInfo;
import com.playdata.reviewservice.common.dto.CommonResDto;
import com.playdata.reviewservice.review.dto.ReviewRequestDto;
import com.playdata.reviewservice.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/review-service")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/review")
    public ResponseEntity<?> createReview(@AuthenticationPrincipal TokenUserInfo tokenUserInfo,
                                          ReviewRequestDto reviewRequestDto) throws IOException {

        reviewService.createReview(reviewRequestDto);
        CommonResDto resDto = new CommonResDto(HttpStatus.CREATED, "리뷰 작성이 완료되었습니다.", null);
        return ResponseEntity.ok().body(resDto);
    }

    @GetMapping("/review/{id}")
    public String getReview() {
        return "review";
    }


}
