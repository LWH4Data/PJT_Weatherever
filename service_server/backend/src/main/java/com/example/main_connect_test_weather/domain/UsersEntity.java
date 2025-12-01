package com.example.main_connect_test_weather.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@DynamicInsert
@NoArgsConstructor
@Getter
@Setter
public class UsersEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "temperature_sensitivity", length = 20)
    private String temperatureSensitivity;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "work_start_time")
    private LocalTime workStartTime;

    @Column(name = "work_end_time")
    private LocalTime workEndTime;
}