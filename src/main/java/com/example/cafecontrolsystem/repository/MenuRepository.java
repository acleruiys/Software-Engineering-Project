package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu_entity, Long> {
    @Query("SELECT m FROM Menu_entity m WHERE m.category.type = :type")
    List<Menu_entity> findByCategoryType(CategoryType type);
    List<Menu_entity> findByAvailableTrue();
} 