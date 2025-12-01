package com.example.main_connect_test_weather.exception;

public class DuplicateUserIdException extends RuntimeException {

    /**
     * 예외가 발생했을 때 전달할 메시지를 받는 생성자
     * @param message 에러 메시지
     */
    public DuplicateUserIdException(String message) {
        // 부모 클래스(RuntimeException)의 생성자를 호출하여 메시지를 설정합니다.
        super(message);
    }
}