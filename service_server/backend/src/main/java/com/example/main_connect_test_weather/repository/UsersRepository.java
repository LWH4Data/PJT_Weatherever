package com.example.main_connect_test_weather.repository;

import com.example.main_connect_test_weather.domain.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<UsersEntity, String> {

}