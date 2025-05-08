package com.playdata.restaurantservice.restaurant.repository;

import com.playdata.restaurantservice.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
