package com.example.main_connect_test_weather.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Immutable
@Entity
@Table(name = "uv_data")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UvDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "forecast_datetime", nullable = false)
    private LocalDateTime forecastDatetime;

    @Column(name = "area_no", nullable = false)
    private Long areaNo;

    @Column(name = "uv_index", nullable = false, precision = 5, scale = 2)
    private BigDecimal uvIndex;

}