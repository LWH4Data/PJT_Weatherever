package com.example.main_connect_test_weather.service;

import com.example.main_connect_test_weather.domain.TrafficInfoEntity;
import com.example.main_connect_test_weather.dto.TrafficInfoDto.NearbyTrafficInfoDto;
import com.example.main_connect_test_weather.dto.TrafficInfoDto.TrafficInfoDto;
import com.example.main_connect_test_weather.repository.TrafficInfoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrafficInfoService {

    private final TrafficInfoRepository trafficInfoRepository;

    public TrafficInfoService(TrafficInfoRepository trafficInfoRepository) {
        this.trafficInfoRepository = trafficInfoRepository;
    }

    public TrafficInfoDto getTrafficInfoService() {

        List<TrafficInfoEntity> trafficInfoList = getTrafficInfoList();
        TrafficInfoDto trafficInfoResponse = packageTrafficInfo(trafficInfoList);

        return trafficInfoResponse;
    }

    private List<TrafficInfoEntity> getTrafficInfoList() {

        return trafficInfoRepository.findAll();
    }

    private TrafficInfoDto packageTrafficInfo(List<TrafficInfoEntity> trafficInfoEntities) {

        List<NearbyTrafficInfoDto> nearbyTrafficInfos = trafficInfoEntities.stream()
                .map(this::EntityToDto)
                .collect(Collectors.toList());

        TrafficInfoDto packageDto = new TrafficInfoDto();

        packageDto.setNearbyTrafficInfos(nearbyTrafficInfos);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분");
        String formattedTime = LocalDateTime.now().format(formatter);
        packageDto.setUpdatedTime(formattedTime);

        return packageDto;
    }

    private NearbyTrafficInfoDto EntityToDto(TrafficInfoEntity trafficInfo) {
        NearbyTrafficInfoDto dto = new NearbyTrafficInfoDto();
        dto.setRoadName(trafficInfo.getRoadName());
        String direction = trafficInfo.getStartRoadName() + " -> " + trafficInfo.getEndRoadName();
        dto.setDirection(direction);
        dto.setDistanceMeters(trafficInfo.getDistance());
        dto.setSpeedKph(trafficInfo.getSpeed());
        dto.setDurationSeconds(trafficInfo.getDuration());

        return dto;
    }
}
