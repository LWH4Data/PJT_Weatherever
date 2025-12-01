package com.example.main_connect_test_weather.controller;

import com.example.main_connect_test_weather.domain.UsersEntity;
import com.example.main_connect_test_weather.dto.users.UserCreateRequestDto;
import com.example.main_connect_test_weather.dto.users.UserResponseDto;
import com.example.main_connect_test_weather.dto.users.UserUpdateRequestDto;
import com.example.main_connect_test_weather.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    // 단일 생성자 코드를 작성하고 있기 때문에, @Autowired 어노테이션은 사실 필요 없다.
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody UserCreateRequestDto createDto) {
        UsersEntity newUser = userService.createUser(createDto);
        // 본문 없이 201 상태 코드만 반환
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(@PathVariable String id, @RequestBody UserUpdateRequestDto updateDto) {
        UsersEntity updatedUser = userService.updateUser(id, updateDto);
        // 본문 없이 200 상태 코드만 반환
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable String id) {
        UserResponseDto userDto = userService.getUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(userDto);
    }
}
