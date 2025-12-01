package com.example.main_connect_test_weather.service;

import com.example.main_connect_test_weather.domain.UsersEntity;
import com.example.main_connect_test_weather.domain.WeatherForecastEntity;
import com.example.main_connect_test_weather.dto.weatherClothes.WeatherClothesDto;
import com.example.main_connect_test_weather.exception.DataNotFoundException;
import com.example.main_connect_test_weather.exception.UserNotFoundException;
import com.example.main_connect_test_weather.repository.UsersRepository;
import com.example.main_connect_test_weather.repository.WeatherForecastRepository;
import com.example.main_connect_test_weather.utils.GeoConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class WeatherClothesService {

    private final WeatherForecastRepository weatherForecastRepository;
    private final GeoConverter geoConverter;
    private final UsersRepository usersRepository;
    private final WeatherUvService weatherUvService;
    private final WeatherAirPollutionService weatherAirPollutionService;

    public WeatherClothesService(
            WeatherForecastRepository weatherForecastRepository,
            GeoConverter geoConverter,
            UsersRepository usersRepository,
            WeatherUvService weatherUvService,
            WeatherAirPollutionService weatherAirPollutionService) {
        this.weatherForecastRepository = weatherForecastRepository;
        this.usersRepository = usersRepository;
        this.geoConverter = geoConverter;
        this.weatherUvService = weatherUvService;
        this.weatherAirPollutionService = weatherAirPollutionService;
    }

    @Transactional(readOnly = true)
    public WeatherClothesDto getWeatherClothes(String userId, double lat, double lon) {
        // 1. 유저 객체, 일기 예보 객체 생성
        UsersEntity user = getUserEntity(userId);
        LocalTime workStartTime = user.getWorkStartTime().minusHours(9);
        LocalTime workEndTime = user.getWorkEndTime().minusHours(9);
//        LocalTime workStartTime = user.getWorkStartTime();
//        LocalTime workEndTime = user.getWorkEndTime();

        // 디버그용 시간 출력
//        System.out.println("외출 시작 시간 : " + workStartTime);
//        System.out.println("외출 종료 시간 : " + workEndTime);

        GeoConverter.Grid grid = geoConverter.convertToGrid(lat, lon);
        List<WeatherForecastEntity> weatherForecastData = getWeatherForecastData(grid.x, grid.y);

        // 2. 외출을 위한 체감온도를 계산하고, 적합한 옷차림을 가져온다.
        BigDecimal highestFeelsLikeTemp = getHighestFeelsLikeTemp(weatherForecastData, workStartTime, workEndTime);
        BigDecimal personalizedHighestFeelsLikeTemp = applyTemperatureSensitivity(highestFeelsLikeTemp, user.getTemperatureSensitivity());
        String determinedOutfit = determineOutfit(personalizedHighestFeelsLikeTemp);

        // 3. 단기 예보 상, 비가 예정 되어있는지를 확인하고, 우산을 챙겨야하는 지를 가져온다.
        Optional<WeatherForecastEntity> isRainToday = getIsRainTodayTest(weatherForecastData, workStartTime, workEndTime);
        Object isWithUmbrella = getIsWithUmbrella(isRainToday);

        // 4. 자외선 지수를 확인하고, 선크림을 챙겨야하는 지를 가져온다.
        String isWithSuncream = weatherUvService.getWeatherUv(grid.x, grid.y);

        // 5. 미세먼지 정도를 확인하고, 마스크를 챙겨야하는 지를 가져온다.
        String isWithMask = weatherAirPollutionService.getWeatherAirPollutionService(grid.x, grid.y);

        return new WeatherClothesDto(determinedOutfit, isWithUmbrella, isWithSuncream, isWithMask);
    }

    private UsersEntity getUserEntity(String userId) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다. (ID: " + userId + ")"));

        return user ;
    }

    private List<WeatherForecastEntity> getWeatherForecastData(int x, int y) {
        List<WeatherForecastEntity> entities = weatherForecastRepository.queryWeatherForecastData(x, y);

        return entities ;
    }

    private Optional<WeatherForecastEntity> getIsRainToday(List<WeatherForecastEntity> entities, LocalTime workStartTime, LocalTime workEndTime) {

        return entities.stream()
                .filter(entity -> {
                    LocalTime forecastTime = entity.getForecastDatetime().toLocalTime();
                    return forecastTime.isAfter(workStartTime) && forecastTime.isBefore(workEndTime);
                })
                .filter(entity -> Integer.parseInt(entity.getPty()) > 0)
                .findFirst();
    }

    /**
     * [신규 비지니스 로직]
     * Optional<WeatherForecastEntity> 객체를 최종 데이터(LocalDateTime 또는 Boolean)로 가공합니다.
     * @param rainForecastOptional 비 예보 정보를 담은 Optional 객체
     * @return 비 예보가 있으면 LocalDateTime, 없으면 Boolean(false)
     */
    private Object getIsWithUmbrella(Optional<WeatherForecastEntity> rainForecastOptional) {
        // 1. 포맷터 패턴을 "MM월 dd일 HH:mm"으로 변경
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM월 dd일 HH:mm");

        return rainForecastOptional
                // 2. .toLocalTime()을 제거하여 LocalDateTime을 직접 포맷팅하고 (Object)로 캐스팅
                .map(forecast -> (Object) forecast.getForecastDatetime().format(formatter))
                .orElse(false);
    }

    private BigDecimal getHighestFeelsLikeTemp(List<WeatherForecastEntity> entities, LocalTime workStartTime, LocalTime workEndTime) {

        return entities.stream()
                .filter(entity -> {
                    LocalTime forecastTime = entity.getForecastDatetime().toLocalTime();
                    return forecastTime.isAfter(workStartTime) && forecastTime.isBefore(workEndTime);
                })
                .map(WeatherForecastEntity::getFeelsLikeTemp)
                .max(Comparator.naturalOrder())
                .orElseThrow(() -> new DataNotFoundException("출퇴근 시간 사이에 해당하는 날씨 데이터가 없습니다."));

    }

    private BigDecimal applyTemperatureSensitivity(BigDecimal feelsLikeTemp, String sensitivity) {
        if ("hot".equals(sensitivity)) {
            return feelsLikeTemp.add(new BigDecimal("3"));
        } else if ("cold".equals(sensitivity)) {
            return feelsLikeTemp.subtract(new BigDecimal("3"));
        } else {
            return feelsLikeTemp;
        }
    }

    private String determineOutfit(BigDecimal feelsLikeTemp) {
        BigDecimal thirteen = new BigDecimal("13");
        BigDecimal twentyThree = new BigDecimal("23");

        // 13도 미만
        if (feelsLikeTemp.compareTo(thirteen) < 0) {
            return "outter";
            // 13도 이상 23도 미만
        } else if (feelsLikeTemp.compareTo(thirteen) >= 0 && feelsLikeTemp.compareTo(twentyThree) < 0) {
            return "long";
            // 23도 이상
        } else {
            return "short";
        }
    }

    private Optional<WeatherForecastEntity> getIsRainTodayTest(List<WeatherForecastEntity> entities,
                                                               LocalTime workStartTime,
                                                               LocalTime workEndTime) {

        // 메서드 내부에서 직접 한국 기준 현재 시각을 생성
        LocalDateTime currentTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

        boolean isOvernight = workStartTime.isAfter(workEndTime);

        return entities.stream()
                // 1. 근무 시간 필터링
                .filter(entity -> {
                    LocalTime forecastTime = entity.getForecastDatetime().toLocalTime();
                    if (isOvernight) {
                        return !forecastTime.isBefore(workStartTime) || forecastTime.isBefore(workEndTime);
                    } else {
                        return !forecastTime.isBefore(workStartTime) && forecastTime.isBefore(workEndTime);
                    }
                })
                // 2. 현재 시간보다 미래 예보인지 필터링
                .filter(entity -> entity.getForecastDatetime().isAfter(currentTime))
                // 3. 강수 예보 필터링
                .filter(entity -> !"0".equals(entity.getPty()))
                // 4. 필터링된 결과 중 첫 번째 예보 반환
                .findFirst();
    }
}