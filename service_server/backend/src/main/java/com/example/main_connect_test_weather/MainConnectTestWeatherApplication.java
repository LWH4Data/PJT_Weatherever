package com.example.main_connect_test_weather;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class MainConnectTestWeatherApplication {

	/**
	 * 애플리케이션 시작 시 JVM의 기본 타임존을 'Asia/Seoul'로 설정합니다.
	 */
	@PostConstruct
	public void started() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}
	public static void main(String[] args) {
		SpringApplication.run(MainConnectTestWeatherApplication.class, args);
	}

}
