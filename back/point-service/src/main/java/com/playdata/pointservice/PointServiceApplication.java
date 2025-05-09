package com.playdata.pointservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
<<<<<<< HEAD
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(basePackages = "com.playdata.pointservice.badge.external.client")
=======

>>>>>>> 8536dc3db21a5aeb0534c647d23876583eaac35d
@SpringBootApplication
public class PointServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PointServiceApplication.class, args);
    }

}
