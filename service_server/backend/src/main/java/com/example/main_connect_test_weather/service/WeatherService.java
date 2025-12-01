package com.example.main_connect_test_weather.service;

import com.example.main_connect_test_weather.client.WeatherClient;
import com.example.main_connect_test_weather.client.WeatherDto.WeatherCurrentDto;
import com.example.main_connect_test_weather.client.WeatherDto.WeatherItem;
import com.example.main_connect_test_weather.client.WeatherDto.WeatherResponse;
import com.example.main_connect_test_weather.utils.GeoConverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeatherService {
    private final WeatherClient weatherClient;
    private final GeoConverter geoConverter;

    /**
     * 의존성 주입: WeatherClient와 Converter 빈을 주입받습니다.
     * @param weatherClient 날씨 API 호출을 담당하는 클라이언트
     * @param geoConverter 위도/경도 좌표를 격자 좌표로 변환하는 컴포넌트
     */

    @Autowired
    public WeatherService(WeatherClient weatherClient, GeoConverter geoConverter) {
        this.weatherClient = weatherClient;
        this.geoConverter = geoConverter;
    }

    /**
     * 위도와 경도를 받아 실시간 날씨 정보를 조회합니다.
     * @param lat 위도
     * @param lon 경도
     * @return API 응답을 담고 있는 Mono<String>
     */
    public Mono<WeatherCurrentDto> getCurrentWeather(double lat, double lon) {
        GeoConverter.Grid grid = geoConverter.convertToGrid(lat, lon);
        String nx = String.valueOf(grid.x);
        String ny = String.valueOf(grid.y);

        return weatherClient.getCurrentWeather(nx, ny)
                .map(this::processWeatherResponse);
    }


    private WeatherCurrentDto processWeatherResponse(WeatherResponse weatherResponse) {
        WeatherCurrentDto weatherCurrentDto = new WeatherCurrentDto();

        List<WeatherItem> items = weatherResponse.getResponse().getBody().getItems().getItem();

        // 날씨 데이터를 key-value 형태로 가공
        var weatherDataMap = items.stream()
                .collect(Collectors.toMap(WeatherItem::getCategory, WeatherItem::getObsrValue));

        // DTO 필드에 데이터 매핑
        if (!items.isEmpty()) {
            weatherCurrentDto.setBaseDate(items.get(0).getBaseDate());
            weatherCurrentDto.setBaseTime(items.get(0).getBaseTime());
        }

        // 관측 데이터를 매핑하고, 필요에 따라 타입 변환
        weatherCurrentDto.setTemperature(Double.parseDouble(weatherDataMap.getOrDefault("T1H", "0.0")));
        weatherCurrentDto.setOneHourPrecipitation(Double.parseDouble(weatherDataMap.getOrDefault("RN1", "0.0")));
        weatherCurrentDto.setHumidity(Double.parseDouble(weatherDataMap.getOrDefault("REH", "0.0")));
        weatherCurrentDto.setWindSpeed(Double.parseDouble(weatherDataMap.getOrDefault("WSD", "0.0")));
        weatherCurrentDto.setWindDirection(Double.parseDouble(weatherDataMap.getOrDefault("VEC", "0.0")));
        weatherCurrentDto.setEastWestWind(Double.parseDouble(weatherDataMap.getOrDefault("UUU", "0.0")));
        weatherCurrentDto.setSouthNorthWind(Double.parseDouble(weatherDataMap.getOrDefault("VVV", "0.0")));

        // 강수 형태(PTY)는 코드값을 문자열로 변환
        weatherCurrentDto.setPrecipitationType(convertPrecipitationType(weatherDataMap.getOrDefault("PTY", "0")));

        // 디버그 코드 추가
        System.out.println("가공된 최종 데이터: " + weatherCurrentDto.toString());

        return weatherCurrentDto;
    }

    public String convertPrecipitationType(String ptyCode) {
        if (ptyCode == null || ptyCode.equals("-1") || ptyCode.equals("0")) {
            return "없음";
        }

        switch (ptyCode) {
            case "1":
                return "비";
            case "2":
                return "비/눈";
            case "3":
                return "눈";
            case "5":
                return "빗방울";
            case "6":
                return "빗방울/눈날림";
            case "7":
                return "눈날림";
            default:
                return "확인불가";
        }
    }

}
