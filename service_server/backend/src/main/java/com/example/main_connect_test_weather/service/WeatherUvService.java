package com.example.main_connect_test_weather.service;

import com.example.main_connect_test_weather.domain.UvDataEntity;
import com.example.main_connect_test_weather.domain.PositionForUvEntity;
import com.example.main_connect_test_weather.domain.WeatherForecastEntity;
import com.example.main_connect_test_weather.exception.DataNotFoundException;
import com.example.main_connect_test_weather.repository.PositionForUvRepository;
import com.example.main_connect_test_weather.repository.UvDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeatherUvService {

    private final PositionForUvRepository positionForUvRepository;
    private final UvDataRepository uvDataRepository;

    @Transactional(readOnly = true)
    public String getWeatherUv(int x, int y) {

        // 1. Grid 좌표를 사용하여 지역 번호(areaNo)를 찾습니다.
        Long areaNo = findAreaCode(x, y);

        // 2. 지역 번호로 최신 자외선 데이터를 조회합니다.
        UvDataEntity uvData = fetchUvData(areaNo);

        // 3. 조회된 자외선 데이터를 바탕으로 사용자에게 보여줄 조언 메시지를 생성합니다.
        return getUvForecast(uvData);
    }

    /**
     * x, y 좌표로 DB에서 지역 번호(areaNo)를 조회합니다.
     */
    private Long findAreaCode(int x, int y) {
        PositionForUvEntity position = positionForUvRepository.findByXAndY(x, y)
                .orElseThrow(() -> new DataNotFoundException("해당 좌표(" + x + ", " + y + ")에 대한 지역 코드 정보가 없습니다."));
        return position.getAreaNo();
    }

    /**
     * 지역 번호(areaNo)로 DB에서 최신 자외선 데이터를 조회합니다.
     */
    private UvDataEntity fetchUvData(Long areaNo) {

        List<UvDataEntity> entities = uvDataRepository.findByAreaNo(areaNo);

        if (entities.isEmpty()) {
            throw new DataNotFoundException("해당 지역(" + areaNo + ")의 자외선 데이터가 없습니다.");
        }

        return entities.stream()
                .sorted(Comparator.comparing(UvDataEntity::getUvIndex).reversed()
                        .thenComparing(UvDataEntity::getForecastDatetime))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("데이터 필터링 중 오류가 발생했습니다."));
    }

    /**
     * 자외선 지수 값에 따라 단계명('위험', '매우 높음' 등)을 반환합니다.
     */
    private String getUvForecast(UvDataEntity uvData) {
        // BigDecimal 값을 비교를 위해 double 값으로 변환합니다.
        double uvIndexValue = uvData.getUvIndex().doubleValue();

        if (uvIndexValue >= 11.0) {
            return "위험";
        } else if (uvIndexValue >= 8.0) {
            return "매우 높음";
        } else if (uvIndexValue >= 6.0) {
            return "높음";
        } else if (uvIndexValue >= 3.0) {
            return "보통";
        } else {
            return "낮음";
        }
    }
}