package com.playdata.userservice.user.service;

import com.playdata.userservice.user.dto.KakaoUserInfoResponseDto;
import com.playdata.userservice.user.external.client.KakaoOAuthClient;
import com.playdata.userservice.user.external.client.KakaoUserInfoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KaKaoLoginService {

    @Autowired
    private KakaoOAuthClient kakaoOAuthClient;
    @Autowired
    private KakaoUserInfoClient kakaoUserInfoClient;

    public KakaoUserInfoResponseDto login(String code) {
        String accessToken = kakaoOAuthClient.requestAccessToken(code);

        return kakaoUserInfoClient.getUserInfoClient(accessToken);
    }


}
