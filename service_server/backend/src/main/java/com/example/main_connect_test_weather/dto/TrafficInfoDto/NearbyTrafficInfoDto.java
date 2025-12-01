package com.example.main_connect_test_weather.dto.TrafficInfoDto;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NearbyTrafficInfoDto {
    private String roadName;
    private String direction;
    private Float distanceMeters;
    private Float speedKph;
    private Float durationSeconds;
}