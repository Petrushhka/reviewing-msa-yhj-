package com.playdata.reviewservice.review.repository;

import com.playdata.reviewservice.review.dto.ReviewStatsDto;
import com.playdata.reviewservice.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<List<Review>> findAllByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    Optional<List<Review>> findAllByUserId(Long userId);

    long countByUserId(Long userId);

    @Query("SELECT new com.playdata.reviewservice.review.dto.ReviewStatsDto(COUNT(r), AVG(r.rating)) FROM Review r WHERE r.restaurantId = :restaurantId")
    ReviewStatsDto getReviewCountAndAverageRating(@Param("restaurantId") Long restaurantId);

}
