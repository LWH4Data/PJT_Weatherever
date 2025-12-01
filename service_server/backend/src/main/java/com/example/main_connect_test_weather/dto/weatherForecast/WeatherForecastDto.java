package com.example.main_connect_test_weather.dto.weatherForecast;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class WeatherForecastDto {
    private LocalDateTime forecastDatetime;
    private BigDecimal pop;
    private String pty;
    private String pcp;
    private BigDecimal reh;
    private String sno;
    private String sky;
    private BigDecimal tmp;
    private BigDecimal uuu;
    private BigDecimal vvv;
    private BigDecimal wav;
    private BigDecimal vec;
    private BigDecimal wsd;
    private BigDecimal feelsLikeTemp;
}