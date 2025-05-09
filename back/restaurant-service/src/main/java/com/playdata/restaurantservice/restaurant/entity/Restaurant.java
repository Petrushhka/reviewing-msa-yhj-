package com.playdata.restaurantservice.restaurant.entity;

import com.playdata.restaurantservice.restaurant.dto.RestaurantResDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tbl_restaurant")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private String address;
    private String phone;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RestaurantImage> images = new ArrayList<>();

    public void addImage(RestaurantImage image) {
        images.add(image);
        image.setRestaurant(this);
        System.out.println("addImage 호출! 이미지 수: " + images.size());
    }

    public RestaurantResDto fromEntity() {
        RestaurantResDto resDto = RestaurantResDto.builder()
                .id(id)
                .userId(userId)
                .name(name)
                .description(description)
                .address(address)
                .phone(phone)
                .build();
        List<String> imageUrls = new ArrayList<>();
        for (RestaurantImage image : images) {
            imageUrls.add(image.getUrl());
        }
        resDto.setImageUrls(imageUrls);
        return resDto;
    }

}
