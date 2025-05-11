package com.playdata.reviewservice.review.service;

import com.playdata.reviewservice.client.UserServiceClient;
import com.playdata.reviewservice.common.config.AwsS3Config;
import com.playdata.reviewservice.review.dto.ReviewRequestDto;
import com.playdata.reviewservice.review.dto.ReviewResponseDto;
import com.playdata.reviewservice.review.dto.UserResDto;
import com.playdata.reviewservice.review.entity.Review;
import com.playdata.reviewservice.review.entity.ReviewImage;
import com.playdata.reviewservice.review.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserServiceClient userServiceClient;
    private final AwsS3Config awsS3Config;

    public void createReview(ReviewRequestDto reviewRequestDto) throws IOException {

        Review review = reviewRequestDto.toEntity();

        if (reviewRequestDto.getImages() != null) {
            List<MultipartFile> reviewImages = reviewRequestDto.getImages();
            for (MultipartFile reviewImage : reviewImages) {
                String uniqueFileName = UUID.randomUUID() + "_" + reviewImage.getOriginalFilename();
                String imageUrl = awsS3Config.uploadToS3Bucket(reviewImage.getBytes(), uniqueFileName);
                ReviewImage image = new ReviewImage();
                image.setUrl(imageUrl);
                image.setSort_order(0);
                review.addImage(image);
            }
        }

        reviewRepository.save(review);
    }

    public List<ReviewResponseDto> getRestaurantReviews(Long restaurantId) {
        List<Review> reviews = reviewRepository.findAllByRestaurantId(restaurantId).orElseThrow(
                () -> new EntityNotFoundException("Review not found!")
        );

        List<ReviewResponseDto> reviewDtos = reviews.stream()
                .map(Review::toResponseDto)
                .collect(Collectors.toList());

        List<Integer> userIds = reviewDtos.stream().map((review) -> review.getUserId().intValue()).collect(Collectors.toList());
        List<UserResDto> userResDtos= userServiceClient.getUserForReivew(userIds);
        Map<Long, String> idToNickname = userResDtos.stream().collect(Collectors.toMap(
                UserResDto::getId,
                UserResDto::getNickName,
                (v1, v2) -> v1 // 중복 키 값 발생 시 기존 값을 유지
        ));
        for (ReviewResponseDto reviewDto : reviewDtos) {
            reviewDto.setNickname(idToNickname.get(reviewDto.getUserId()));
        }
        log.info("User reviews found: " + userResDtos.size());
        return reviewDtos;
    }

    public List<ReviewResponseDto> getUserReviews(Long id) {
        List<Review> reviews = reviewRepository.findAllByUserId(id).orElseThrow(
                () -> new EntityNotFoundException("Review not found!")
        );
        return reviews.stream()
                .map(Review::toResponseDto)
                .collect(Collectors.toList());
    }

    public void deleteReview(Long id, String email) throws Exception {
        Review review = reviewRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Review not found!")
        );

        UserResDto userResDto = userServiceClient.getUserByEmail(email);
        if(userResDto == null) {
            throw new EntityNotFoundException("User not found for delete review!!");
        } else if(!userResDto.getId().equals(review.getUserId())) {
            throw new EntityNotFoundException("User id not matched for delete review!!");
        }

        for (ReviewImage reviewImage : review.getImages()) {
            awsS3Config.deleteFromS3Bucket(reviewImage.getUrl());
        }
        reviewRepository.delete(review);
    }

    public void updateReview(ReviewRequestDto reviewRequestDto, String email) {
        Review review = reviewRepository.findById(reviewRequestDto.getId()).orElseThrow(
                () -> new EntityNotFoundException("Review not found!")
        );
        UserResDto userResDto = userServiceClient.getUserByEmail(email);
        if(userResDto == null) {
            throw new EntityNotFoundException("User not found for update review!!");
        } else if(!userResDto.getId().equals(review.getUserId())) {
            throw new EntityNotFoundException("User id not matched for update review!!");
        }

        review.setRating(reviewRequestDto.getRating());
        review.setContent(reviewRequestDto.getContent());
        reviewRepository.save(review);
    }
}
