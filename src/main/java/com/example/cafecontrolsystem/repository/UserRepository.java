package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    Optional<User> findByPhone(String phone);
    boolean existsByPhone(String phone);
} 
