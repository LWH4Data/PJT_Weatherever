package com.example.main_connect_test_weather.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "traffic_info")
public class TrafficInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "road_name", nullable = false)
    private String roadName;

    @Column(name = "start_road_name", nullable = false)
    private String startRoadName;

    @Column(name = "end_road_name", nullable = false)
    private String endRoadName;

    @Column(nullable = false)
    private Float distance;

    @Column(nullable = false)
    private Float speed;

    @Column(nullable = false)
    private Float duration;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;
}