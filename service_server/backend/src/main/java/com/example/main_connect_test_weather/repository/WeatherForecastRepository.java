package com.example.main_connect_test_weather.repository;

import com.example.main_connect_test_weather.domain.WeatherForecastEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface WeatherForecastRepository extends JpaRepository<WeatherForecastEntity, Long> {

    /**
     * 특정 x, y 좌표에 해당하는 모든 예보 데이터를 조회합니다.
     * 데이터가 최신 데이터로 업데이트되므로, 이 메서드를 통해 항상 최신 정보를 가져올 수 있습니다.
     * @param x 그리드 x 좌표
     * @param y 그리드 y 좌표
     * @return 주어진 좌표에 해당하는 WeatherForecastEntity 리스트
     */
    List<WeatherForecastEntity> findByXAndY(int x, int y);

    @Query(value = "SELECT w FROM WeatherForecastEntity w WHERE w.x = :x AND w.y = :y ORDER BY w.forecastDatetime ASC LIMIT 26")
    List<WeatherForecastEntity> queryWeatherForecastData(int x, int y);

    @Query(value = "SELECT w FROM WeatherForecastEntity w " +
            "WHERE w.x = :x AND w.y = :y " +
            "AND w.forecastDatetime >= :now " + // <--- 현재 시간보다 크거나 같은 데이터만 선택
            "ORDER BY w.forecastDatetime ASC LIMIT 24")
    List<WeatherForecastEntity> queryWeatherForecastDataAfterNow(int x, int y, LocalDateTime now);

}