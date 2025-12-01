package com.example.main_connect_test_weather.client.WeatherDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherResponse {
    @JsonProperty("response")
    private Response response;

    @Getter
    @Setter
    public static class Response {
        private Header header;
        private WeatherBody body;
    }

    @Getter
    @Setter
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

}