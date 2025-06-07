package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);
    boolean existsByUsername(String username);

    Optional<Admin> findByPhone(String phone);
    boolean existsByPhone(String phone);
} 
