package com.playdata.restaurantservice.common.config;

import com.playdata.restaurantservice.common.auth.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        // cross site request forgery
        http.csrf(csrf -> csrf.disable());

//        http.cors(Customizer.withDefaults());

        // 세션 관리 상태 안쓰고 STATELESS한 토큰 사용할게
        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // url 요청 권한 설정
        http.authorizeHttpRequests(auth ->
                auth.requestMatchers("/restaurant-service/restaurants",
                                "/restaurant-service/restaurant/list").permitAll()
                        .requestMatchers(HttpMethod.GET, "/restaurant-service/restaurants/{id}").permitAll()
                        .anyRequest().authenticated()
        );
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
