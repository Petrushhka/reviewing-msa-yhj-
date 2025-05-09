package com.playdata.restaurantservice.restaurant.repository;

import com.playdata.restaurantservice.restaurant.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("SELECT r FROM Restaurant r WHERE r.name LIKE %?1%")
    Page<Restaurant> findByNameValue(String keyword, Pageable pageable);

    @Query("SELECT r FROM Restaurant r WHERE r.address LIKE %?1%")
    Page<Restaurant> findByAddressValue(String keyword, Pageable pageable);

}
