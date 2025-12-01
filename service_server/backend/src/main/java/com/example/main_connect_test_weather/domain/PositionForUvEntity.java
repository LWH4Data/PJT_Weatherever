package com.example.main_connect_test_weather.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "position_for_uv")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PositionForUvEntity {

    @Id
    @Column(name = "area_no", nullable = false)
    private Long areaNo;

    @Column(name = "x", nullable = false)
    private Integer x;

    @Column(name = "y", nullable = false)
    private Integer y;

}