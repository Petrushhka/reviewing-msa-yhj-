package com.playdata.restaurantservice.restaurant.service;

import com.playdata.restaurantservice.common.config.AwsS3Config;
import com.playdata.restaurantservice.restaurant.dto.RestaurantIdDto;
import com.playdata.restaurantservice.restaurant.dto.RestaurantReqDto;
import com.playdata.restaurantservice.restaurant.dto.RestaurantResDto;
import com.playdata.restaurantservice.restaurant.dto.RestaurantSearchDto;
import com.playdata.restaurantservice.restaurant.entity.Restaurant;
import com.playdata.restaurantservice.restaurant.entity.RestaurantImage;
import com.playdata.restaurantservice.restaurant.repository.RestaurantRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final AwsS3Config awsS3Config;

    // 상점 등록
    public void RestaurantCreate(RestaurantReqDto restaurantReqDto) throws IOException {
        Restaurant restaurant = restaurantReqDto.toEntity();

        List<MultipartFile> restaurantImages = restaurantReqDto.getImages();
        for (MultipartFile restaurantImage : restaurantImages) {
            String uniqueFileName = UUID.randomUUID() + "_" + restaurantImage.getOriginalFilename();
            String imageUrl = awsS3Config.uploadToS3Bucket(restaurantImage.getBytes(), uniqueFileName);
            RestaurantImage image = new RestaurantImage();
            image.setUrl(imageUrl);
            image.setSort_order(0);
            restaurant.addImage(image);
        }

        restaurantRepository.save(restaurant);
    }

    // 상점 수정
    public void updateRestaurantInfo(Long restaurantId, RestaurantReqDto dto) throws Exception {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new EntityNotFoundException("restaurant not found"));

        // 기본 정보 수정
        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setPhone(dto.getPhone());

        // 1. 삭제할 이미지 처리
        List<String> deletedImageUrls = dto.getDeletedImageUrls();
        if (deletedImageUrls != null) {
            restaurant.getImages().removeIf(image -> {
                if (deletedImageUrls.contains(image.getUrl())) {
                    try {
                        awsS3Config.deleteFromS3Bucket(image.getUrl());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return true; // 리스트에서도 제거
                }
                return false;
            });
        }

        // 2. 새 이미지 추가 처리
        List<MultipartFile> restaurantImages = dto.getImages();
        if (restaurantImages != null) {
            for (MultipartFile restaurantImage : restaurantImages) {
                String uniqueFileName = UUID.randomUUID() + "_" + restaurantImage.getOriginalFilename();
                String imageUrl = awsS3Config.uploadToS3Bucket(restaurantImage.getBytes(), uniqueFileName);

                RestaurantImage image = new RestaurantImage();
                image.setUrl(imageUrl);
                image.setSort_order(0);
                image.setRestaurant(restaurant); // 연관관계 바인딩 필수!

                restaurant.getImages().add(image);
            }
        }

        // 3. 저장 (CascadeType.ALL 덕분에 자식도 자동 저장)
        restaurantRepository.save(restaurant);
    }

    // 단일 상점 조회
    public RestaurantResDto getRestaurantDetail(Long id) {
        Restaurant foundRestaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("restaurant not found"));
        return foundRestaurant.fromEntity();
    }

    // 상점 삭제
    public void restaurantDelete(Long id) throws Exception {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("restaurant with id: " + id + " not found")
        );
        List<RestaurantImage> images = restaurant.getImages();
        for (RestaurantImage image : images) {
            awsS3Config.deleteFromS3Bucket(image.getUrl());
        }
        restaurantRepository.deleteById(id);
    }

    // 상점 목록
    public List<RestaurantResDto> restaurantList(RestaurantSearchDto dto, Pageable pageable) {
        Page<Restaurant> restaurants;
        if (dto.getSearchName() == null) {
            restaurants = restaurantRepository.findAll(pageable);
        } else if (!dto.getSearchName().isEmpty() && !dto.getAddress().isEmpty()){
            restaurants = restaurantRepository.findByNameAndAddressValue(dto.getSearchName(), pageable);
        } else if (!dto.getSearchName().isEmpty()) {
            restaurants = restaurantRepository.findByNameValue(dto.getSearchName(), pageable);
        } else {
            restaurants = restaurantRepository.findByAddressValue(dto.getAddress(), pageable);
        }

        List<Restaurant> restaurantList = restaurants.getContent();

        return restaurantList.stream()
                .map(Restaurant::fromEntity)
                .collect(Collectors.toList());
    }

    public RestaurantIdDto getRestaurantIdByUserId(Long userId) {
        Restaurant restaurant = restaurantRepository.findByUserId(userId);
        RestaurantIdDto restaurantIdDto = new RestaurantIdDto(restaurant.getId());
        return restaurantIdDto;
    }
}
