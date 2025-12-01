package com.example.main_connect_test_weather.utils;

import org.springframework.stereotype.Component;

@Component
public class GeoConverter {

    // 격자 X, Y 좌표
    public static class Grid {
        public int x;
        public int y;

        public Grid(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    // 위도, 경도 값
    public static class LatLon {
        public double lat;
        public double lon;

        public LatLon(double lat, double lon) {
            this.lat = lat;
            this.lon = lon;
        }
    }

    // 지도 관련 상수
    private static final double PI = Math.asin(1.0) * 2.0;
    private static final double DEGRAD = PI / 180.0;
    private static final double RADDEG = 180.0 / PI;

    private static final double RE = 6371.00877; // 지도반경 (km)
    private static final double GRID = 5.0;      // 격자간격 (km)
    private static final double SLAT1 = 30.0;    // 표준위도 1
    private static final double SLAT2 = 60.0;    // 표준위도 2
    private static final double OLON = 126.0;    // 기준점 경도
    private static final double OLAT = 38.0;     // 기준점 위도
    private static final double XO = 210.0 / GRID; // 기준점 X좌표
    private static final double YO = 675.0 / GRID; // 기준점 Y좌표

    private static final double sn, sf, ro;

    static {
        double slat1_rad = SLAT1 * DEGRAD;
        double slat2_rad = SLAT2 * DEGRAD;
        double olat_rad = OLAT * DEGRAD;

        double temp_sn = Math.tan(PI * 0.25 + slat2_rad * 0.5) / Math.tan(PI * 0.25 + slat1_rad * 0.5);
        sn = Math.log(Math.cos(slat1_rad) / Math.cos(slat2_rad)) / Math.log(temp_sn);

        double temp_sf = Math.tan(PI * 0.25 + slat1_rad * 0.5);
        sf = Math.pow(temp_sf, sn) * Math.cos(slat1_rad) / sn;

        double temp_ro = Math.tan(PI * 0.25 + olat_rad * 0.5);
        ro = RE / GRID * sf / Math.pow(temp_ro, sn);
    }

    /** 위경도 → 격자 좌표 */
    public static Grid convertToGrid(double lat, double lon) {
        double re = RE / GRID;
        double theta = lon * DEGRAD - (OLON * DEGRAD);
        if (theta > PI) theta -= 2.0 * PI;
        if (theta < -PI) theta += 2.0 * PI;
        theta *= sn;

        double ra = Math.tan(PI * 0.25 + lat * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);

        double x = ra * Math.sin(theta) + XO;
        double y = ro - ra * Math.cos(theta) + YO;

        return new Grid((int)(x + 1.5), (int)(y + 1.5));
    }

    /** 격자 좌표 → 위경도 */
    public static LatLon convertToLatLon(double x, double y) {
        double xn = x - 1.0 - XO;
        double yn = ro - (y - 1.0) + YO;

        double ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) ra = -ra;

        double alat = Math.pow((RE / GRID * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - PI * 0.5;

        double theta;
        if (xn == 0.0) {
            theta = 0.0;
        } else if (yn == 0.0) {
            theta = PI * 0.5;
            if (xn < 0.0) theta = -theta;
        } else {
            theta = Math.atan2(xn, yn);
        }

        double alon = theta / sn + (OLON * DEGRAD);

        return new LatLon(alat * RADDEG, alon * RADDEG);
    }
}
