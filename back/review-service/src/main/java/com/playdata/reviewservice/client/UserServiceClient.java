package com.playdata.reviewservice.client;


import com.playdata.reviewservice.review.dto.UserResDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @PostMapping("/user-service/users")
    public List<UserResDto> getUserForReivew(@RequestBody List<Integer> userIds);
}
