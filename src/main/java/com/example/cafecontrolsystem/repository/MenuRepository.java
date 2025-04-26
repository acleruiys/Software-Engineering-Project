package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByCategory(MenuCategory category);
    List<Menu> findByAvailableTrue();
} 