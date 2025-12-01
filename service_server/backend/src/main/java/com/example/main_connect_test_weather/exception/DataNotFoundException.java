package com.example.main_connect_test_weather.exception;

public class DataNotFoundException extends RuntimeException {
    public DataNotFoundException(String message) {
        super(message);
    }
}