package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.UserDto;
import com.example.cafecontrolsystem.entity.User;
import com.example.cafecontrolsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

/**
 * 사용자 관련 서비스 클래스
 * 사용자 등록, 로그인 처리 및 비밀번호 암호화 기능을 제공합니다.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 새로운 사용자를 등록합니다.
     * 
     * @param userDto 사용자 등록 정보를 담은 DTO
     * @return 저장된 사용자 엔티티
     * @throws IllegalArgumentException 사용자명이 이미 존재할 경우 발생
     */
    public User registerUser(UserDto userDto) {
        // 중복 사용자 확인
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자명입니다.");
        }
        else if(userRepository.existsByPhone(userDto.getPhone())){
            throw new IllegalArgumentException("이미 존재하는 전화번호입니다.");
        }
        // 사용자 객체 생성
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(encodePassword(userDto.getPassword()));
        user.setPhone(userDto.getPhone());
        user.setRole(User.UserRole.valueOf(userDto.getRole()));

        // 데이터베이스에 저장
        return userRepository.save(user);
    }
    
    /**
     * 사용자 로그인 인증을 처리합니다.
     * 
     * @param username 사용자명
     * @param password 비밀번호
     * @return 인증된 사용자 엔티티
     * @throws IllegalArgumentException 사용자가 존재하지 않거나 비밀번호가 일치하지 않을 경우 발생
     */
    public User loginUser(String username, String password) {
        // 사용자 조회
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        
        User user = userOptional.get();
        
        // 비밀번호 검증
        if (!user.getPassword().equals(encodePassword(password))) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        
        return user;
    }
    
    /**
     * 비밀번호를 안전하게 암호화합니다.
     * 
     * 암호화 방식: SHA-256 해시 알고리즘 + Base64 인코딩
     * 
     * 현재 사용 중인 암호화 과정:
     * 1. MessageDigest 클래스를 사용하여 SHA-256 해시 알고리즘 인스턴스 생성
     * 2. 비밀번호 문자열을 UTF-8 바이트 배열로 변환
     * 3. 해시 알고리즘을 사용하여 바이트 배열 해시화
     * 4. 해시된 바이트 배열을 Base64로 인코딩하여 문자열로 변환
     * 
     * 보안 수준: 기본적인 단방향 해시 암호화만 적용됨
     * 참고: 프로덕션 환경에서는 솔트(Salt) 추가, 반복 해싱, bcrypt/PBKDF2/Argon2와 같은
     * 더 강력한 알고리즘 사용이 권장됨
     * 
     * @param password 암호화할 원본 비밀번호
     * @return 암호화된 비밀번호 문자열
     */
    private String encodePassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256이 지원되지 않는 경우 (거의 발생하지 않음)
            return password;
        }
    }
} 
