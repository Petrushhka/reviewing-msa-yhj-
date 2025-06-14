package com.playdata.userservice.user.controller;

import com.playdata.userservice.user.dto.KakaoUserInfoResponseDto;
import com.playdata.userservice.user.external.client.KakaoOAuthClient;
import com.playdata.userservice.user.external.client.KakaoUserInfoClient;
import com.playdata.userservice.user.service.KaKaoLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-service/oauth/kakao")
public class KakaoController {

    @Autowired
    private KaKaoLoginService loginService;

    @GetMapping("")
   public KakaoUserInfoResponseDto doLogin(@RequestParam("code") String code) {

        return loginService.login(code);
    }




}
