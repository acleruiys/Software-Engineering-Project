package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.MenuCategory_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory_entity, Long> {
    Optional<MenuCategory_entity> findByType(CategoryType type);
    Optional<MenuCategory_entity> findByName(String name);
} 