package com.example.main_connect_test_weather.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DbConnectionChecker implements CommandLineRunner {

    // application.properties에 설정된 spring.datasource.url 값을 주입받음
    @Value("${spring.datasource.url}")
    private String dbUrl;

    // application.properties에 설정된 spring.datasource.username 값을 주입받음
    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("========================================");
        System.out.println("           DB Connection Status         ");
        System.out.println("========================================");
        System.out.println("DB URL: " + dbUrl);
        System.out.println("DB User: " + dbUsername);
        System.out.println("========================================");
    }
}