package com.playdata.reviewservice.review.service;

import com.playdata.reviewservice.common.config.AwsS3Config;
import com.playdata.reviewservice.review.dto.ReviewRequestDto;
import com.playdata.reviewservice.review.entity.Review;
import com.playdata.reviewservice.review.entity.ReviewImage;
import com.playdata.reviewservice.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final AwsS3Config awsS3Config;

    public void createReview(ReviewRequestDto reviewRequestDto) throws IOException {
        MultipartFile reviewImage = reviewRequestDto.getImages().get(0);
        String uniqueFileName = UUID.randomUUID() + "_" + reviewImage.getOriginalFilename();
        String imageUrl = awsS3Config.uploadToS3Bucket(reviewImage.getBytes(), uniqueFileName);

        Review review = reviewRequestDto.toEntity();
        ReviewImage image = new ReviewImage();
        image.setUrl(imageUrl);
        image.setSort_order(0);
        review.addImage(image);

        reviewRepository.save(review);
    }
}
