package com.example.main_connect_test_weather.repository;


import com.example.main_connect_test_weather.domain.UvDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UvDataRepository extends JpaRepository<UvDataEntity, Integer> {

    /**
     * 지역 번호(areaNo)를 사용하여 최신 자외선 데이터를 조회합니다.
     *
     * @param areaNo 조회할 지역 번호
     * @return UvDataEntity 객체를 담은 Optional
     */
    List<UvDataEntity> findByAreaNo(Long areaNo);

}
