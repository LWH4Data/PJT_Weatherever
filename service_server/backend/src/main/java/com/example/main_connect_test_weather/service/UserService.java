package com.example.main_connect_test_weather.service;

import com.example.main_connect_test_weather.domain.UsersEntity;
import com.example.main_connect_test_weather.dto.users.UserResponseDto;
import com.example.main_connect_test_weather.exception.DuplicateUserIdException;
import com.example.main_connect_test_weather.exception.UserNotFoundException;
import com.example.main_connect_test_weather.repository.UsersRepository;
import com.example.main_connect_test_weather.dto.users.UserCreateRequestDto;
import com.example.main_connect_test_weather.dto.users.UserUpdateRequestDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UsersRepository usersRepository;

    public UserService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Transactional
    public UsersEntity createUser(UserCreateRequestDto createDto) {
        String userId = createDto.getId();

        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 ID는 필수 입력값입니다.");
        }

        if (usersRepository.existsById(userId)) {
            throw new DuplicateUserIdException("이미 사용 중인 아이디입니다: " + userId);
        }

        UsersEntity newUser = new UsersEntity();
        newUser.setId(createDto.getId());

        return usersRepository.save(newUser);
    }

    @Transactional
    public UsersEntity updateUser(String id, UserUpdateRequestDto updateDto) {
        UsersEntity targetUser = usersRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

        // 업데이트할 필드만 DTO에서 가져와 설정
        if (updateDto.getTemperatureSensitivity() != null) {
            targetUser.setTemperatureSensitivity(updateDto.getTemperatureSensitivity());
        }
        if (updateDto.getWorkStartTime() != null) {
            targetUser.setWorkStartTime(updateDto.getWorkStartTime());
        }
        if (updateDto.getWorkEndTime() != null) {
            targetUser.setWorkEndTime(updateDto.getWorkEndTime());
        }

        return usersRepository.save(targetUser);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUser(String id) {
        UsersEntity targetUser = usersRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

        return toDto(targetUser);
    }

    // 엔티티를 DTO로 변환하는 private 메서드
    private UserResponseDto toDto(UsersEntity entity) {
        return new UserResponseDto(
                entity.getId(),
                entity.getTemperatureSensitivity(),
                entity.getWorkStartTime(),
                entity.getWorkEndTime()
        );
    }
}