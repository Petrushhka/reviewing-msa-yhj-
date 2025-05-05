package com.playdata.reviewservice.review.controller;

import com.playdata.reviewservice.review.dto.ReviewRequestDto;
import com.playdata.reviewservice.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/review-service")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/review")
    public ResponseEntity<?> createReview(ReviewRequestDto reviewRequestDto) {
        reviewService.createReview(reviewRequestDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/review/{id}")
    public String getReview() {
        return "review";
    }


}
