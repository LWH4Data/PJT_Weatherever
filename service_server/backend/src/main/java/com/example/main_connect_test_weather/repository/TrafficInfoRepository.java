package com.example.main_connect_test_weather.repository;

import com.example.main_connect_test_weather.domain.TrafficInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrafficInfoRepository extends JpaRepository<TrafficInfoEntity, Long> {

}