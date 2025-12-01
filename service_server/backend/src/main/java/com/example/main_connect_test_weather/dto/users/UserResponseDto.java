package com.example.main_connect_test_weather.dto.users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalTime;

@AllArgsConstructor // 모든 필드를 포함하는 생성자를 만듭니다.
@Getter // Getter만 허용합니다.
public class UserResponseDto {
    private final String id;
    private final String temperatureSensitivity;
    private final LocalTime workStartTime;
    private final LocalTime workEndTime;
}