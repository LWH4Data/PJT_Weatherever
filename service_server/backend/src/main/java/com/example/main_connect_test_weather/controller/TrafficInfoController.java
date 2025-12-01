package com.example.main_connect_test_weather.controller;

import com.example.main_connect_test_weather.dto.TrafficInfoDto.TrafficInfoDto;
import com.example.main_connect_test_weather.service.TrafficInfoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/traffic-info")
public class TrafficInfoController {

    private final TrafficInfoService trafficInfoService;

    public TrafficInfoController(TrafficInfoService trafficInfoService) {
        this.trafficInfoService = trafficInfoService;
    }

    @GetMapping
    public ResponseEntity<TrafficInfoDto> getTrafficInfo() {

        TrafficInfoDto response = trafficInfoService.getTrafficInfoService();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
