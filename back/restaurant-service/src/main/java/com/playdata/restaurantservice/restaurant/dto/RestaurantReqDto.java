package com.playdata.restaurantservice.restaurant.dto;

import com.playdata.restaurantservice.restaurant.entity.Restaurant;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantReqDto {

    private String name;
    private String description;
    private String address;
    private String phone;
    private Long userId; // 사장님 ID

    private List<MultipartFile> images;

    public Restaurant toEntity() {
        return Restaurant.builder()
                .name(name)
                .description(description)
                .address(address)
                .phone(phone)
                .userId(userId)
                .build();
    }

}
