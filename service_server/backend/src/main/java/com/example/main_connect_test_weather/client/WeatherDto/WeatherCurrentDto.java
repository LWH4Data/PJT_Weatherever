package com.example.main_connect_test_weather.client.WeatherDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherCurrentDto {
    private String baseDate; // 관측 날짜
    private String baseTime; // 관측 시간
    private double temperature; // 기온 (°C) - T1H
    private double oneHourPrecipitation; // 1시간 강수량 (mm) - RN1
    private double windSpeed; // 풍속 (m/s) - WSD
    private double humidity; // 습도 (%) - REH
    private String precipitationType; // 강수 형태 (문자열 변환) - PTY
    private double windDirection; // 풍향 (deg) - VEC
    private double eastWestWind; // 동서바람성분 (m/s) - UUU
    private double southNorthWind; // 남북바람성분 (m/s) - VVV

    @Override
    public String toString() {
        return "WeatherCurrentDto{" +
                "baseDate='" + baseDate + '\'' +
                ", baseTime='" + baseTime + '\'' +
                ", temperature=" + temperature +
                ", oneHourPrecipitation=" + oneHourPrecipitation +
                ", windSpeed=" + windSpeed +
                ", humidity=" + humidity +
                ", precipitationType='" + precipitationType + '\'' +
                ", windDirection=" + windDirection +
                ", eastWestWind=" + eastWestWind +
                ", southNorthWind=" + southNorthWind +
                '}';
    }
}