package com.example.main_connect_test_weather.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.reactive.function.client.WebClient;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    // final 필드로 선언하여 불변성 유지
    private final String adminId;
    private final String adminPassword;

    public SecurityConfig(
            @Value("${security.admin.username}") String adminId,
            @Value("${security.admin.password}") String adminPassword) {
        this.adminId = adminId;
        this.adminPassword = adminPassword;
    }

    @Bean
    public MapReactiveUserDetailsService userDetailsService() {
        UserDetails user = User.builder()
                .username(adminId)
                .password(passwordEncoder().encode(adminPassword))
                .roles("ADMIN")
                .build();
        return new MapReactiveUserDetailsService(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 최신 앱에서 표준으로 사용되는 BCryptPasswordEncoder를 명시적으로 사용
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                // 1. CSRF 보호 비활성화
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        // 2. Actuator 엔드포인트에만 인증 요구
                        .pathMatchers("/actuator/**").authenticated()
                        // 3. 나머지 모든 요청은 허용
                        .anyExchange().permitAll()
                )
                // 4. HTTP Basic 인증 사용
                .httpBasic(withDefaults());
        return http.build();
    }
}