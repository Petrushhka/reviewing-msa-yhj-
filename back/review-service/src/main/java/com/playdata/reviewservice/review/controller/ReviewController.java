package com.playdata.reviewservice.review.controller;

import com.playdata.reviewservice.common.auth.TokenUserInfo;
import com.playdata.reviewservice.common.dto.CommonResDto;
import com.playdata.reviewservice.review.dto.ReviewRequestDto;
import com.playdata.reviewservice.review.dto.ReviewResponseDto;
import com.playdata.reviewservice.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

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

    @GetMapping("/reviews/restaurant/{restaurantId}")
    public ResponseEntity<?> getRestaurantReviews(@PathVariable Long restaurantId) {
        List<ReviewResponseDto> reviews = reviewService.getRestaurantReviews(restaurantId);

        CommonResDto resDto = new CommonResDto(
                HttpStatus.OK, "리뷰 얻어오기 성공!", reviews
        );
        return ResponseEntity.ok().body(resDto);
    }

    @GetMapping("/reviews/user/{id}")
    public ResponseEntity<?> getUserReviews(@PathVariable Long id) {
        List<ReviewResponseDto> userReviews = reviewService.getUserReviews(id);
        CommonResDto resDto = new CommonResDto(
                HttpStatus.OK, "리뷰 얻어오기 성공!", userReviews
        );
        return ResponseEntity.ok().body(resDto);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@AuthenticationPrincipal TokenUserInfo tokenUserInfo,
                                          @PathVariable Long id) throws Exception {
        reviewService.deleteReview(id, tokenUserInfo.getEmail());
        CommonResDto resDto = new CommonResDto(
                HttpStatus.OK, "리뷰 삭제 완료!", null
        );
        return ResponseEntity.ok().body(resDto);
    }


}
