package com.playdata.restaurantservice.restaurant.service;

import com.playdata.restaurantservice.common.config.AwsS3Config;
import com.playdata.restaurantservice.restaurant.dto.RestaurantReqDto;
import com.playdata.restaurantservice.restaurant.dto.RestaurantResDto;
import com.playdata.restaurantservice.restaurant.entity.Restaurant;
import com.playdata.restaurantservice.restaurant.entity.RestaurantImage;
import com.playdata.restaurantservice.restaurant.repository.RestaurantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final AwsS3Config awsS3Config;

    // 가게 등록
    public void RestaurantCreate(RestaurantReqDto restaurantReqDto) throws IOException {
        MultipartFile restaurantImage = restaurantReqDto.getImages().get(0);
        String uniqueFileName = UUID.randomUUID() + "_" + restaurantImage.getOriginalFilename();
        String imageUrl = awsS3Config.uploadToS3Bucket(restaurantImage.getBytes(), uniqueFileName);

        Restaurant restaurant = restaurantReqDto.toEntity();
        RestaurantImage image = new RestaurantImage();
        image.setUrl(imageUrl);
        image.setSort_order(0);
        restaurant.addImage(image);

        restaurantRepository.save(restaurant);
    }

    // 가게 수정
    public void updateRestaurantInfo(Long restaurantId, RestaurantResDto dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new EntityNotFoundException("restaurant not found"));
        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setLatitude(dto.getLatitude());
        restaurant.setLongitude(dto.getLongitude());
        restaurant.setPhone(dto.getPhone());
        restaurantRepository.save(restaurant);
    }

    // 단일 가게 조회
    public RestaurantResDto getRestaurantDetail(Long id) {
        Restaurant foundRestaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("restaurant not found"));
        return foundRestaurant.fromEntity();
    }

    // 가게 삭제
    public void restaurantDelete(Long id) throws Exception {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("restaurant with id: " + id + " not found")
        );
        List<RestaurantImage> images = restaurant.getImages();
        awsS3Config.deleteFromS3Bucket(images.toString());
        restaurantRepository.deleteById(id);
    }
}
