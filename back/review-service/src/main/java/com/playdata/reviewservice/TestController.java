package com.playdata.reviewservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/review-service")
public class TestController {
    @GetMapping("/test")
    public String test() {
        return "test success";
    }
}
