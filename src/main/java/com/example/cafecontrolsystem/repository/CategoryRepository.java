package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.MenuCategory_entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<MenuCategory_entity, Long> {

}