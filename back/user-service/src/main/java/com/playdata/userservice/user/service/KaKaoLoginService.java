package com.playdata.userservice.user.service;

import com.playdata.userservice.user.dto.KakaoUserInfoResponseDto;
import com.playdata.userservice.user.dto.UserRequestDto;
import com.playdata.userservice.user.entity.User;
import com.playdata.userservice.user.external.client.KakaoOAuthClient;
import com.playdata.userservice.user.external.client.KakaoUserInfoClient;
import com.playdata.userservice.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class KaKaoLoginService {

    @Autowired
    private KakaoOAuthClient kakaoOAuthClient;
    @Autowired
    private KakaoUserInfoClient kakaoUserInfoClient;
    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> login(String code) {

        // 카카오 토큰 요청
        String accessToken = kakaoOAuthClient.requestAccessToken(code);

        // 카카오 사용자 정보 요청
        KakaoUserInfoResponseDto kakaoUser = kakaoUserInfoClient.getUserInfoClient(accessToken);

        String kakaoId = kakaoUser.getId(); // 카카오 고유 Id
        String email = kakaoUser.getKakaoAccount().getEmail();
        String nickname = kakaoUser.getKakaoAccount().getProfile().getNickname();
        String profileImageUrl = kakaoUser.getKakaoAccount().getProfile().getProfileImageUrl();

        //DB에서 kakaoId로 사용자 중복확인
        User foundUserBykakaoId = userRepository.findBykakaoId(kakaoId);

        Map<String, Object> result = new HashMap<>(); // 프론트엔드로 보낼 결과 매핑

        if (foundUserBykakaoId != null) {
            // Case 1: 카카오 ID로 찾은 사용자가 있음 -> 바로 로그인 처리
            // 현재 UserLoginReqDto 및 관련 서비스와 연동 필요
            result.put("status", "LOGIN_SUCCESS");
            result.put("message", "카카오 계정으로 로그인되었습니다.");
            // result.put("token", "YOUR_JWT_TOKEN"); // 로그인 성공 시 JWT 토큰 포함
            // result.put("userInfo", userResDto); // 로그인된 사용자 정보
        } else {
            // Case 2 or 3: 카카오 ID로 찾은 사용자가 없음 -> 이메일로 다시 조회 (기존 일반 계정 여부 확인)
            User foundUserByEmail = userRepository.findBykakaoId(email);

            if (foundUserByEmail != null) {
                // Case 2: 카카오 ID는 없지만 이메일이 이미 존재 -> 연동 제안
                result.put("status", "EMAIL_EXISTS_SUGGEST_LINK");
                result.put("message", "해당 이메일로 가입된 계정이 있습니다. 카카오 계정을 연동하시겠습니까?");
                result.put("nickName", nickname);
                result.put("email", email);
                result.put("profileImageUrl", profileImageUrl);
                result.put("kakaoId", kakaoId); // 연동을 위해 kakaoId도 함께 넘겨줌
            } else {
                // Case 3: 카카오 ID도, 이메일도 없음 -> 신규 회원가입 유도
                result.put("status", "NEW_USER_SIGNUP");
                result.put("message", "새로운 회원입니다. 추가 정보를 입력해 주세요.");
                result.put("nickName", nickname);
                result.put("email", email);
                result.put("profileImageUrl", profileImageUrl);
                result.put("kakaoId", kakaoId); // 신규 가입 시에도 kakaoId 저장해야 함
            }

        }
        return result;
    }


}
