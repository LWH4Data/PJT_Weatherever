package com.example.main_connect_test_weather.repository;


import com.example.main_connect_test_weather.domain.PositionForUvEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PositionForUvRepository extends JpaRepository<PositionForUvEntity, Long> {

    /**
     * x, y 좌표를 사용하여 위치 정보 엔티티를 조회합니다.
     *
     * @param x 조회할 x 좌표
     * @param y 조회할 y 좌표
     * @return PositionForUvEntity 객체를 담은 Optional (결과가 없을 수도 있음)
     */
    Optional<PositionForUvEntity> findByXAndY(int x, int y);

}