package com.playdata.pointservice.badge.external.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// user-service 이름은 Eureka 등록된 서비스명 또는 직접 URL
@FeignClient(name = "user-service")
public interface UserPointClient {
    @GetMapping("/user/{userId}/point")
    int getUserPoint(@PathVariable Long userId);
}
