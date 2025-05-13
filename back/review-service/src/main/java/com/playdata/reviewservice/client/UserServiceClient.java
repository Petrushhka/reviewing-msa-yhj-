package com.playdata.reviewservice.client;


import com.playdata.reviewservice.review.dto.UserResDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @PostMapping("/user-service/users")
    public List<UserResDto> getUserForReivew(@RequestBody List<Integer> userIds);

    @GetMapping("/user-service/users")
    public UserResDto getUserByEmail(@RequestParam String email);

    @PutMapping("/user-service/users/point")
    public UserResDto updatePoint(@RequestParam Long userId, @RequestParam int point );
}
