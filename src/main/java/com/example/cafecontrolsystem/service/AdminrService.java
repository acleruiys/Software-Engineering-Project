package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.AdminDto;
import com.example.cafecontrolsystem.dto.SaveEmployeeDto;
import com.example.cafecontrolsystem.entity.Admin;
import com.example.cafecontrolsystem.repository.AdminRepository;
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
public class AdminrService {

    private final AdminRepository adminRepository;
    private final EmployeeService employeeService;

    @Autowired
    public AdminrService(AdminRepository adminRepository, EmployeeService employeeService) {
        this.adminRepository = adminRepository;
        this.employeeService = employeeService;
    }

    /**
     * 새로운 사용자를 등록합니다.
     * 
     * @param adminDto 사용자 등록 정보를 담은 DTO
     * @return 저장된 사용자 엔티티
     * @throws IllegalArgumentException 사용자명이 이미 존재할 경우 발생
     */
    public Admin registerUser(AdminDto adminDto) {
        // 이름 길이 제한
        if (adminDto.getUsername() == null || adminDto.getUsername().length() < 2 || adminDto.getUsername().length() > 20) {
            throw new IllegalArgumentException("이름은 2자 이상 20자 이하로 입력해주세요.");
        }
        // 전화번호 형식 검증
        if (adminDto.getPhone() == null) {
            throw new IllegalArgumentException("전화번호를 입력해주세요.");
        }
        
        // 010-0000-0000 형식 검증
        if (!adminDto.getPhone().matches("^010-\\d{4}-\\d{4}$")) {
            throw new IllegalArgumentException("전화번호는 '010-xxxx-xxxx'와 같은 형식으로 입력해주세요.");
        }
        
        // 비밀번호 길이 제한
        if (adminDto.getPassword() == null || adminDto.getPassword().length() < 4 || adminDto.getPassword().length() > 20) {
            throw new IllegalArgumentException("비밀번호는 4자 이상 20자 이하로 입력해주세요.");
        }
        // 역할 유효성 검사
        if (adminDto.getRole() == null || adminDto.getRole().isEmpty()) {
            throw new IllegalArgumentException("역할을 선택해주세요.");
        }
        try {
            Admin.UserRole.valueOf(adminDto.getRole());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("유효하지 않은 역할입니다.");
        }
        // 중복 사용자 확인
        if (adminRepository.existsByUsername(adminDto.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자명입니다.");
        }
        // 중복 전화번호 확인
        else if(adminRepository.existsByPhone(adminDto.getPhone())){
            throw new IllegalArgumentException("이미 존재하는 전화번호입니다.");
        }
        // 사용자 객체 생성
        Admin admin = new Admin();
        admin.setUsername(adminDto.getUsername());
        admin.setPassword(encodePassword(adminDto.getPassword()));
        admin.setPhone(adminDto.getPhone());
        admin.setRole(Admin.UserRole.valueOf(adminDto.getRole()));

        // 데이터베이스에 저장
        Admin savedAdmin = adminRepository.save(admin);
        
        // 직원(STAFF) 역할인 경우 Employee 데이터베이스에도 저장
        if (admin.getRole() == Admin.UserRole.STAFF) {
            SaveEmployeeDto saveEmployeeDto = new SaveEmployeeDto(admin.getUsername(), "part_time");
            employeeService.saveEmployee(saveEmployeeDto);
        }
        
        return savedAdmin;
    }
    
    /**ㅣ
     * 사용자 로그인 인증을 처리합니다.
     * 
     * @param username 사용자명
     * @param password 비밀번호
     * @return 인증된 사용자 엔티티
     * @throws IllegalArgumentException 사용자가 존재하지 않거나 비밀번호가 일치하지 않을 경우 발생
     */
    public Admin loginUser(String username, String password) {
        // 사용자 조회
        Optional<Admin> userOptional = adminRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        
        Admin admin = userOptional.get();
        
        // 비밀번호 검증
        if (!admin.getPassword().equals(encodePassword(password))) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        
        return admin;
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
