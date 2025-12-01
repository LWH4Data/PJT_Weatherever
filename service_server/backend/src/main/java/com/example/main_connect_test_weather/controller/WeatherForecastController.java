package com.example.main_connect_test_weather.controller;

import com.example.main_connect_test_weather.dto.weatherForecast.WeatherForecastSummaryDto;
import com.example.main_connect_test_weather.service.WeatherForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/weather-forecast")
public class WeatherForecastController {

    private final WeatherForecastService weatherForecastService;

    @Autowired
    public WeatherForecastController(WeatherForecastService weatherForecastService) {
        this.weatherForecastService = weatherForecastService;
    }

    @GetMapping("/summary")
    public ResponseEntity<List<WeatherForecastSummaryDto>> getWeatherSummary(
            // default 좌표로 대전광역시를 매핑합니다.
            @RequestParam(defaultValue = "36.3504") double lat,
            @RequestParam(defaultValue = "127.3849") double lon) {

        // 컨트롤러는 위경도를 그대로 서비스에 전달
        List<WeatherForecastSummaryDto> summaryData = weatherForecastService.getWeatherForecastSummary(lat, lon);

        return ResponseEntity.status(HttpStatus.OK).body(summaryData);
    }
}