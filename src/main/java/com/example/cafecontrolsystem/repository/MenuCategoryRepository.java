package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.MenuCategory;
import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    Optional<MenuCategory> findByType(CategoryType type);
    Optional<MenuCategory> findByName(String name);
} 