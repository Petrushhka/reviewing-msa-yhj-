package com.playdata.pointservice.common.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

// 이 클래스는 FeignClient로 외부 또는 다른 마이크로서비스에 HTTP 요청을 보낼 때
// Authorization 헤더(JWT 토큰)를 자동으로 붙이기 위해 사용되는 설정 클래스
@Configuration // 스프링 설정 클래스로 등록됨 (Bean으로 관리됨)
public class FeignClientConfig implements RequestInterceptor {

    // 이 메서드는 FeignClient가 호출될 때마다 자동으로 실행
    // 여기서 RequestTemplate은 HTTP 요청을 만들기 위한 템플릿 객체입니다.
    @Override
    public void apply(RequestTemplate template) {

        // 현재 사용자의 인증 정보를 Spring Security의 컨텍스트에서 가져옵니다.
        // 로그인된 사용자의 정보는 SecurityContextHolder 안에 저장되어 있습니다.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 인증 정보가 존재하고, 그 인증 객체 안에 있는 'credentials'가 JWT 문자열이인 경우
        // (보통 credentials는 JWT 토큰이 들어있습니다)
        if (auth != null && auth.getCredentials() instanceof String token) {

            // Authorization 헤더에 "Bearer {토큰}" 형식으로 JWT 토큰을 추가합니다.
            // 이렇게 하면 이 FeignClient로 호출하는 모든 요청에 자동으로 JWT가 붙게 됩니다.
            template.header("Authorization", "Bearer" + token);
        }

        // 만약 인증 정보가 없거나, credentials에 JWT가 들어있지 않으면 아무것도 하지 않습니다.
        // 이 경우 호출 대상 서버에서 401 또는 403 에러가 발생할 수 있습니다.

    }
}
