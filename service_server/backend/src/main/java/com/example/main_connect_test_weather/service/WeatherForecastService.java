package com.example.main_connect_test_weather.service;

import com.example.main_connect_test_weather.domain.WeatherForecastEntity;
import com.example.main_connect_test_weather.dto.weatherForecast.WeatherForecastSummaryDto;
import com.example.main_connect_test_weather.exception.DataNotFoundException;
import com.example.main_connect_test_weather.repository.WeatherForecastRepository;
import com.example.main_connect_test_weather.utils.GeoConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class WeatherForecastService {

    private final WeatherForecastRepository weatherForecastRepository;
    private final GeoConverter geoConverter;

    @Autowired
    public WeatherForecastService(WeatherForecastRepository weatherForecastRepository, GeoConverter geoConverter) {
        this.weatherForecastRepository = weatherForecastRepository;
        this.geoConverter = geoConverter;

    }

    public List<WeatherForecastSummaryDto> getWeatherForecastSummary(double lat, double lon) {
        GeoConverter.Grid grid = geoConverter.convertToGrid(lat, lon);

        // 서울 기준 현재 시간 객체
        ZoneId seoulZoneId = ZoneId.of("Asia/Seoul");
        LocalDateTime nowInKst = ZonedDateTime.now(seoulZoneId).toLocalDateTime();

        // 세계 표준시 기준 현재 시간 객체
        ZoneId utcZoneId = ZoneId.of("UTC");
        LocalDateTime nowInUtc = LocalDateTime.now(utcZoneId);


        List<WeatherForecastEntity> entities = weatherForecastRepository.queryWeatherForecastDataAfterNow(grid.x, grid.y, nowInKst);

        if (entities.isEmpty()) {
            throw new DataNotFoundException("해당 위경도에 대한 날씨 데이터를 찾을 수 없습니다. (lat=" + lat + ", lon=" + lon + ")");
        }

        return entities.stream()
                .map(WeatherForecastSummaryDto::fromEntity) // 엔티티 객체를 DTO 객체로 변환
                .collect(Collectors.toList()); // DTO 객체들을 리스트로 수집
    }
}