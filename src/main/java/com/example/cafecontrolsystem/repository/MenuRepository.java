package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByCategory(String category);
    List<Menu> findByAvailableTrue();

    Optional<Menu> findByName(String name);
} 