package com.playdata.restaurantservice.restaurant.controller;

import com.playdata.restaurantservice.common.dto.CommonResDto;
import com.playdata.restaurantservice.restaurant.dto.RestaurantReqDto;
import com.playdata.restaurantservice.restaurant.dto.RestaurantResDto;
import com.playdata.restaurantservice.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/restaurant-service")
public class RestaurantController {

    private final RestaurantService restaurantService;

    // 가게 등록
    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/restaurants")
    public ResponseEntity<?> createRestaurant(RestaurantReqDto restaurantReqDto) throws IOException {
        restaurantService.RestaurantCreate(restaurantReqDto);
        CommonResDto resDto = new CommonResDto(HttpStatus.CREATED, "가게 등록 완료되었습니다.", null);
        return new ResponseEntity<>(resDto, HttpStatus.CREATED);
    }

    // 가게 수정
    @PutMapping("/restaurant/{id}")
    public ResponseEntity<?> updateRestaurant(@RequestBody RestaurantResDto dto) {
        Long restaurantId = dto.getId();
        restaurantService.updateRestaurantInfo(restaurantId, dto);
        CommonResDto resDto = new CommonResDto(HttpStatus.OK, "수정 완료되었습니다.", null);
        return ResponseEntity.ok().body(resDto);
    }

    // 단일 가게 조회
    @GetMapping("/restaurant/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable Long id) {
        RestaurantResDto dto = restaurantService.getRestaurantDetail(id);
        CommonResDto resDto = new CommonResDto(HttpStatus.OK, "조회 완료되었습니다.", dto);
        return ResponseEntity.ok().body(resDto);
    }

    // 가게 삭제
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    @DeleteMapping("/restaurant/{id}")
    public ResponseEntity<?> deleteRestaurant(@RequestParam("id") Long id) throws Exception {
        restaurantService.restaurantDelete(id);
        CommonResDto resDto = new CommonResDto(HttpStatus.OK, "삭제 완료되었습니다.", id);
        return ResponseEntity.ok().body(resDto);
    }


}
