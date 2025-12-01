package com.example.main_connect_test_weather.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<String> handleDataNotFoundException(DataNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateUserIdException.class)
    public ResponseEntity<String> handleDuplicateUserIdException(DuplicateUserIdException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    // 기존의 IllegalArgumentException 핸들러는 그대로 유지하여 다른 경우에 사용
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST); // HTTP 400 반환
    }
}