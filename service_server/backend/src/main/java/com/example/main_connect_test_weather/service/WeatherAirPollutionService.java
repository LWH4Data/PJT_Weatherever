package com.example.main_connect_test_weather.service;

import com.example.main_connect_test_weather.domain.AirPollutionDataEntity;
import com.example.main_connect_test_weather.domain.PositionForAirPollutionEntity;
import com.example.main_connect_test_weather.exception.DataNotFoundException;
import com.example.main_connect_test_weather.repository.AirPollutionDataRepository;
import com.example.main_connect_test_weather.repository.PositionForAirPollutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class WeatherAirPollutionService {

    private final AirPollutionDataRepository airPollutionDataRepository;
    private final PositionForAirPollutionRepository positionForAirPollutionRepository;

    public String getWeatherAirPollutionService(int x, int y) {

        String locationCode = findLocationCode(x, y);
        String airPollutionData = fetchAirPollutionData(locationCode).trim();

        return airPollutionData ;

    }

    private String findLocationCode(int x, int y) {

        PositionForAirPollutionEntity position = positionForAirPollutionRepository.findFirstByXAndYOrderByIdDesc(x, y)
                .orElseThrow(() -> new DataNotFoundException("좌표(x=" + x + ", y=" + y + ")에 해당하는 위치 정보가 없습니다."));

        return position.getLocationCode();
    }

    private String fetchAirPollutionData(String locationCode) {

        AirPollutionDataEntity data = airPollutionDataRepository.findFirstByLocationCodeOrderByIdDesc(locationCode)
                .orElseThrow(() -> new DataNotFoundException(locationCode + "에 해당하는 대기 오염 정보가 없습니다."));

        return data.getGrade();
    }
}
