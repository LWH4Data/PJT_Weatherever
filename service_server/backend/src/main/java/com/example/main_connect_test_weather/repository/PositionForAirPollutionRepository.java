package com.example.main_connect_test_weather.repository;

import com.example.main_connect_test_weather.domain.PositionForAirPollutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PositionForAirPollutionRepository extends JpaRepository<PositionForAirPollutionEntity, Integer> {

    /**
     * 동일한 X, Y 좌표를 가진 데이터가 여러 개 있을 경우,
     * ID를 내림차순으로 정렬하여 가장 최근에 생성된 데이터 1개만 조회합니다.
     *
     * @param x X 좌표
     * @param y Y 좌표
     * @return 조회된 위치 정보 엔티티(Optional)
     */
    Optional<PositionForAirPollutionEntity> findFirstByXAndYOrderByIdDesc(Integer x, Integer y);

}