package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id; // 사용자 ID

    @Column(nullable = false, unique = true)
    private String username; // 사용자 이름

    @Column(nullable = false)
    private String password; // 사용자 비밀번호

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.STAFF;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;


    public enum UserRole {
        ADMIN, MANAGER, STAFF
    }

    public enum UserStatus {
        ACTIVE, INACTIVE
    }
} 