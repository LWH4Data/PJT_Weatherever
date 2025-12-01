package com.example.main_connect_test_weather.dto.weatherClothes;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class WeatherClothesDto {

    private final String outfit;
    private final Object rainInfo;
    private final String uvInfo;
    private final String airPollutionInfo;

}