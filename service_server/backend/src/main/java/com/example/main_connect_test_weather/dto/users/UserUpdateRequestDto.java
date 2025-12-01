package com.example.main_connect_test_weather.dto.users;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class UserUpdateRequestDto {
    private String temperatureSensitivity;

    @Schema(type = "string", example = "09:00:00", description = "HH:mm:ss 형식의 근무 시작 시간")
    private LocalTime workStartTime;

    @Schema(type = "string", example = "18:00:00", description = "HH:mm:ss 형식의 근무 종료 시간")
    private LocalTime workEndTime;
}