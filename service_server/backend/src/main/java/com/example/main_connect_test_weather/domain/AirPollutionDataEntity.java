package com.example.main_connect_test_weather.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "air_pollution_data")
public class AirPollutionDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "forecast_datetime", nullable = false)
    private LocalDateTime forecastDatetime;

    @Column(name = "location_code", nullable = false, length = 20)
    private String locationCode;

    @Column(name = "grade", nullable = false, length = 20)
    private String grade;

}