package com.example.main_connect_test_weather.dto.TrafficInfoDto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TrafficInfoDto {
    private String updatedTime;
    private List<NearbyTrafficInfoDto> nearbyTrafficInfos;
}