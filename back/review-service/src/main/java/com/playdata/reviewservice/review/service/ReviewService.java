package com.playdata.reviewservice.review.service;

import com.playdata.reviewservice.review.dto.ReviewRequestDto;
import com.playdata.reviewservice.review.entity.Review;
import com.playdata.reviewservice.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public void createReview(ReviewRequestDto reviewRequestDto) {
        Review review = reviewRequestDto.toEntity();
        String originalFileName = reviewRequestDto.getImages().get(0).getOriginalFilename();
        reviewRepository.save(review);
    }
}
