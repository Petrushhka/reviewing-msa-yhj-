package com.playdata.restaurantservice.restaurant.dto;

import lombok.*;

@Setter @Getter @ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantSearchDto {

    private String searchName;
    private String address;

}
