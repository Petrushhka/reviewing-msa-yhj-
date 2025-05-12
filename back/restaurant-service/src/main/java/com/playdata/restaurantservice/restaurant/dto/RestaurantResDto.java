package com.playdata.restaurantservice.restaurant.dto;

import lombok.*;

import java.time.LocalDateTime;
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
    private String phone;
    private Long userId;
    private LocalDateTime createdAt;

    private List<String> imageUrls;

}
