package com.example.main_connect_test_weather.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "position_for_air_pollution")
public class PositionForAirPollutionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "region", nullable = false, length = 20)
    private String region;

    @Column(name = "sub_region", nullable = false, length = 20)
    private String subRegion;

    @Column(name = "location_code", nullable = false, length = 10)
    private String locationCode;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "x", nullable = false)
    private Integer x;

    @Column(name = "y", nullable = false)
    private Integer y;

}