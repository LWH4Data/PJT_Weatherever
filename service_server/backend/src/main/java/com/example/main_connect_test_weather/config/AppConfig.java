package com.example.main_connect_test_weather.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
public class AppConfig implements WebFluxConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8081") // React 개발 서버 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
                // 토큰, 쿠키 같은 인증을 위한 추가 정보를 사용하지 않으므로 불필요한 설정
                // .allowCredentials(true);
    }
}