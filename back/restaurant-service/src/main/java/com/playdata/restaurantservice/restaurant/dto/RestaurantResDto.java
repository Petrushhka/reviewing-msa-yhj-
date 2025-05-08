package com.playdata.restaurantservice.restaurant.dto;

import lombok.*;

import java.util.List;

@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResDto {

    private Long id;
    private String name;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private String phone;
    private Long userId;

    private List<String> imageUrls;
    private Double averageRating;
    private int reviewCount;

}
