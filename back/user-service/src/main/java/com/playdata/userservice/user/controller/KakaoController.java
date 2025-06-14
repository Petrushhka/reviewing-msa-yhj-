package com.playdata.userservice.user.controller;

import com.playdata.userservice.user.external.client.KakaoOAuthClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-service/oauth/kakao")
public class KakaoController {

    @Autowired
    private KakaoOAuthClient kakaoOAuthClient;

    @GetMapping("")
   public String kakaoLogin(@RequestParam("code") String code) {

        return kakaoOAuthClient.requestAccessToken(code);
    }

}
