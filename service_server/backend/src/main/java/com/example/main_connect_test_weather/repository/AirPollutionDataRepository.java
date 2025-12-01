package com.example.main_connect_test_weather.repository;

import com.example.main_connect_test_weather.domain.AirPollutionDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AirPollutionDataRepository extends JpaRepository<AirPollutionDataEntity, Integer> {

    Optional<AirPollutionDataEntity> findFirstByLocationCodeOrderByIdDesc(String locationCode);

}