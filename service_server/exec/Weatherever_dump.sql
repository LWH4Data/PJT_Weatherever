INSERT INTO `air_pollution_data` VALUES (1,'2025-09-29 00:24:14','LOC7','보통');
INSERT INTO `air_pollution_data` VALUES (2,'2025-09-29 01:24:14','LOC8','나쁨');
INSERT INTO `air_pollution_data` VALUES (3,'2025-09-29 02:24:14','LOC5','나쁨');
INSERT INTO `air_pollution_data` VALUES (4,'2025-09-29 03:24:14','LOC10','나쁨');
INSERT INTO `air_pollution_data` VALUES (5,'2025-09-29 04:24:14','LOC5','보통');
INSERT INTO `air_pollution_data` VALUES (6,'2025-09-29 05:24:14','LOC9','매우나쁨');
INSERT INTO `air_pollution_data` VALUES (7,'2025-09-29 06:24:14','LOC1','나쁨');
INSERT INTO `air_pollution_data` VALUES (8,'2025-09-29 07:24:14','LOC9','나쁨');
INSERT INTO `air_pollution_data` VALUES (9,'2025-09-29 08:24:14','LOC8','나쁨');
INSERT INTO `air_pollution_data` VALUES (10,'2025-09-29 09:24:14','LOC10','보통');

INSERT INTO `clothes` VALUES (1,'Cloth_1','top','t-shirt','IMG_001');
INSERT INTO `clothes` VALUES (2,'Cloth_2','top','hoodie','IMG_002');
INSERT INTO `clothes` VALUES (3,'Cloth_3','bottom','jeans','IMG_003');
INSERT INTO `clothes` VALUES (4,'Cloth_4','bottom','shorts','IMG_004');
INSERT INTO `clothes` VALUES (5,'Cloth_5','shoes','sneakers','IMG_005');
INSERT INTO `clothes` VALUES (6,'Cloth_6','shoes','boots','IMG_006');
INSERT INTO `clothes` VALUES (7,'Cloth_7','accessory','umbrella','IMG_007');
INSERT INTO `clothes` VALUES (8,'Cloth_8','accessory','scarf','IMG_008');

INSERT INTO `forecast_weather_data` VALUES (1,'2025-09-29 00:24:14',43.13,'비','6.5',20.97,'1.0','흐림',10.43,3.91,1.77,4.73,203.8,8.54,24.92,62,50);
INSERT INTO `forecast_weather_data` VALUES (2,'2025-09-29 01:24:14',72.03,'없음','3.8',72.94,'2.2','맑음',11.06,1.22,-3.51,0.96,51.7,8.8,2.25,106,64);
INSERT INTO `forecast_weather_data` VALUES (3,'2025-09-29 02:24:14',7.54,'비','4.1',70.37,'0.3','흐림',15.55,3.74,-0.52,4.96,67.02,11.81,34.21,102,88);
INSERT INTO `forecast_weather_data` VALUES (4,'2025-09-29 03:24:14',16.05,'비','9.1',27.91,'0.9','맑음',20.05,3.22,-3.45,0.82,152.52,3.75,-7.25,42,137);
INSERT INTO `forecast_weather_data` VALUES (5,'2025-09-29 04:24:14',45.61,'비','8.1',74.39,'1.1','구름많음',2.11,-0.35,2.84,1.66,151.75,4.42,-6.89,24,138);
INSERT INTO `forecast_weather_data` VALUES (6,'2025-09-29 05:24:14',41.8,'없음','3.4',49.86,'1.3','맑음',13.02,5.0,2.42,3.43,296.15,6.95,8.45,105,102);
INSERT INTO `forecast_weather_data` VALUES (7,'2025-09-29 06:24:14',83.85,'없음','1.4',74.97,'0.6','맑음',13.9,1.79,1.93,4.97,9.18,4.53,30.61,47,86);
INSERT INTO `forecast_weather_data` VALUES (8,'2025-09-29 07:24:14',77.05,'없음','6.5',26.15,'1.1','구름많음',2.83,-1.79,2.16,1.03,187.37,7.49,2.09,51,62);
INSERT INTO `forecast_weather_data` VALUES (9,'2025-09-29 08:24:14',8.1,'없음','6.4',55.9,'2.3','구름많음',9.27,2.1,-4.11,1.97,250.18,9.62,7.01,41,67);
INSERT INTO `forecast_weather_data` VALUES (10,'2025-09-29 09:24:14',58.57,'눈','5.6',32.13,'0.1','흐림',-2.14,4.88,-0.75,2.53,77.64,3.76,34.38,23,106);

INSERT INTO `outfit_rules` VALUES (1,-10,0,1,3);
INSERT INTO `outfit_rules` VALUES (2,0,10,2,3);
INSERT INTO `outfit_rules` VALUES (3,10,20,2,4);
INSERT INTO `outfit_rules` VALUES (4,20,30,1,3);
INSERT INTO `outfit_rules` VALUES (5,30,40,2,4);

INSERT INTO `position_for_air_pollution` VALUES (1,'서울특별시','강남구','영동',36.550486,126.979803,74,88);
INSERT INTO `position_for_air_pollution` VALUES (2,'경기도','수원시','경기남부',37.659358,127.430058,104,112);

INSERT INTO `position_for_uv` VALUES (120,133,1100000000);
INSERT INTO `position_for_uv` VALUES (18,115,1100000001);

INSERT INTO `road_link_info` VALUES (1,0,'Start_0',1,'End_0',5,'Road_0',6.33,'서울시');
INSERT INTO `road_link_info` VALUES (2,10,'Start_1',11,'End_1',4,'Road_1',6.87,'서울시');
INSERT INTO `road_link_info` VALUES (3,20,'Start_2',21,'End_2',3,'Road_2',9.32,'서울시');
INSERT INTO `road_link_info` VALUES (4,30,'Start_3',31,'End_3',4,'Road_3',4.77,'서울시');
INSERT INTO `road_link_info` VALUES (5,40,'Start_4',41,'End_4',3,'Road_4',9.67,'경기도');

INSERT INTO `traffic_info` VALUES (1,'Road_0','Start_0','End_0',1.97,34.36,47.68,'2025-09-29 00:24:14');
INSERT INTO `traffic_info` VALUES (2,'Road_1','Start_1','End_1',1.19,48.22,19.62,'2025-09-29 00:24:14');
INSERT INTO `traffic_info` VALUES (3,'Road_2','Start_2','End_2',13.21,98.08,17.18,'2025-09-29 00:24:14');
INSERT INTO `traffic_info` VALUES (4,'Road_3','Start_3','End_3',11.64,20.68,39.52,'2025-09-29 00:24:14');
INSERT INTO `traffic_info` VALUES (5,'Road_4','Start_4','End_4',16.78,50.95,34.57,'2025-09-29 00:24:14');

INSERT INTO `users` VALUES ('f5c0aaae-9727-43dc-9791-0e6c63970f88','low','2025-09-29 00:24:14','09:00:00','18:00:00');
INSERT INTO `users` VALUES ('768e0829-4225-438e-bc82-82825005a2ff','normal','2025-09-29 00:24:14','09:00:00','18:00:00');
INSERT INTO `users` VALUES ('14c9a4ea-bb4b-4740-9d01-2d389f34dddd','normal','2025-09-29 00:24:14','09:00:00','18:00:00');

INSERT INTO `uv_data` VALUES (1,'2025-09-29 00:24:14',1100000000,4.32);
INSERT INTO `uv_data` VALUES (2,'2025-09-29 01:24:14',1100000000,3.0);
INSERT INTO `uv_data` VALUES (3,'2025-09-29 02:24:14',1100000000,0.22);
INSERT INTO `uv_data` VALUES (4,'2025-09-29 03:24:14',1100000000,5.16);
INSERT INTO `uv_data` VALUES (5,'2025-09-29 04:24:14',1100000000,2.14);
INSERT INTO `uv_data` VALUES (6,'2025-09-29 05:24:14',1100000000,9.69);
INSERT INTO `uv_data` VALUES (7,'2025-09-29 06:24:14',1100000000,9.65);
INSERT INTO `uv_data` VALUES (8,'2025-09-29 07:24:14',1100000000,8.5);
INSERT INTO `uv_data` VALUES (9,'2025-09-29 08:24:14',1100000000,2.49);
INSERT INTO `uv_data` VALUES (10,'2025-09-29 09:24:14',1100000000,8.17);

