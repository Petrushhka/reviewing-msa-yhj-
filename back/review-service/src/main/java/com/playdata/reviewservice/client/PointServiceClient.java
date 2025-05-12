package com.playdata.reviewservice.client;

import com.playdata.reviewservice.review.dto.UserBadgeResDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "point-service")
public interface PointServiceClient {
    @GetMapping("/badges/user/{userId}")
    public UserBadgeResDto getUserBadgeByUserId(@PathVariable Long userId);
}
