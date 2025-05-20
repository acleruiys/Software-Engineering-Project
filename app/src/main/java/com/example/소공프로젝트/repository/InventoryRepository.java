package com.example.소공프로젝트.repository;


import com.example.소공프로젝트.Entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {}

