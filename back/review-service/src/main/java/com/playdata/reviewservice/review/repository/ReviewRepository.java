package com.playdata.reviewservice.review.repository;

import com.playdata.reviewservice.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<List<Review>> findAllByRestaurantId(Long restaurantId);

    Optional<List<Review>> findAllByUserId(Long userId);
}
