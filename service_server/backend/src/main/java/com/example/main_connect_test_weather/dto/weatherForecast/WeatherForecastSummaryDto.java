package com.example.main_connect_test_weather.dto.weatherForecast;

import com.example.main_connect_test_weather.domain.WeatherForecastEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class WeatherForecastSummaryDto {
    private LocalDateTime forecastDatetime;
    private String sky;
    private String pty;
    private BigDecimal tmp;
    private BigDecimal pop;

    /**
     * WeatherForecastEntity 객체로부터 WeatherSummaryDto 객체를 생성하는 정적 팩토리 메서드.
     * @param entity 변환할 WeatherForecastEntity 객체
     * @return 요약된 날씨 정보를 담은 WeatherSummaryDto 객체
     */
    public static WeatherForecastSummaryDto fromEntity(WeatherForecastEntity entity) {
        WeatherForecastSummaryDto dto = new WeatherForecastSummaryDto();
        dto.setForecastDatetime(entity.getForecastDatetime());
        dto.setSky(entity.getSky());
        dto.setPty(entity.getPty());
        dto.setTmp(entity.getTmp());
        dto.setPop(entity.getPop());
        return dto;
    }
}