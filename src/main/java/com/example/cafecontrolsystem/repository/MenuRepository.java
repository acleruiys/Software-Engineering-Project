package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu_entity, Long> {

    List<Menu_entity> findByCategory(String category);
    List<Menu_entity> findByAvailableTrue();

    Optional<Menu_entity> findByName(String name);
} 