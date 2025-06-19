package com.playdata.userservice.user.external.client;

import com.playdata.userservice.user.dto.AssignBadgeReqDto;
import com.playdata.userservice.user.dto.UserBadgeResDto;
import com.playdata.userservice.user.dto.UserResDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "point-service" )
public interface BadgeClient {
    @GetMapping("/badges/user/{userId}")
    UserBadgeResDto getUserBadge(@PathVariable("userId") Long userId);



}
