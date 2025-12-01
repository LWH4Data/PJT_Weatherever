package com.example.main_connect_test_weather.controller;

import com.example.main_connect_test_weather.client.WeatherDto.WeatherCurrentDto;
import com.example.main_connect_test_weather.dto.weatherClothes.WeatherClothesDto;
import com.example.main_connect_test_weather.service.WeatherClothesService;
import com.example.main_connect_test_weather.service.WeatherService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;


/**
 * 날씨 정보 API 요청을 처리하는 restful 컨트롤러입니다.
 */
@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;
    private final WeatherClothesService weatherClothesService;

    @Autowired
    public WeatherController(WeatherService weatherService, WeatherClothesService weatherClothesService) {
        this.weatherService = weatherService;
        this.weatherClothesService = weatherClothesService;
    }

    @GetMapping
    public Mono<WeatherCurrentDto> getCurrentWeather(
            // default 좌표로 대전광역시를 매핑합니다.
            @RequestParam(defaultValue = "36.3504") double lat,
            @RequestParam(defaultValue = "127.3849") double lon) {
        return weatherService.getCurrentWeather(lat, lon);
    }

    @GetMapping("/clothes")
    public ResponseEntity<WeatherClothesDto> getWeatherClothes(
            @RequestParam String id,
            // default 좌표로 유성구청을 매핑합니다.
            @RequestParam(defaultValue = "36.3504") double lat,
            @RequestParam(defaultValue = "127.3849") double lon) {
        WeatherClothesDto weatherClothes = weatherClothesService.getWeatherClothes(id, lat, lon);

        return ResponseEntity.status(HttpStatus.OK).body(weatherClothes);
    }
}