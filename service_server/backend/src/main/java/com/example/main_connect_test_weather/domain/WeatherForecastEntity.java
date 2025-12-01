package com.example.main_connect_test_weather.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Immutable
@Entity
@Table(name = "forecast_weather_data")
@Getter
@Setter
@NoArgsConstructor
public class WeatherForecastEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "forecast_datetime")
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

    @Column(name = "feels_like_temp")
    private BigDecimal feelsLikeTemp;

    private Integer x;
    private Integer y;

    // 생성자, toString 등 필요한 메서드 추가
}