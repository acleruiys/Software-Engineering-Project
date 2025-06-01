package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.MenuCategory_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory_entity, Long> {
    List<Menu_entity> findByCategory(String category);
    List<Menu_entity> findByAvailableTrue();

    Optional<Menu_entity> findByName(String name);
} 