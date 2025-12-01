package com.example.main_connect_test_weather.client.WeatherDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class WeatherBody {
    @JsonProperty("dataType")
    private String dataType;
    @JsonProperty("items")
    private Items items;
    @JsonProperty("pageNo")
    private int pageNo;
    @JsonProperty("numOfRows")
    private int numOfRows;
    @JsonProperty("totalCount")
    private int totalCount;

    @Getter
    @Setter
    public static class Items {
        @JsonProperty("item")
        private List<WeatherItem> item;
    }
}