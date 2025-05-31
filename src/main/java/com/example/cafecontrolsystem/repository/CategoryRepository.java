package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.entity.MenuCategory_entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<MenuCategory_entity, Long> {

    Optional<MenuCategory_entity> findByType(CategoryType type);
}