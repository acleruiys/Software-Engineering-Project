package com.example.소공프로젝트.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.소공프로젝트.Entity.Supply;

public interface SupplyRepository extends JpaRepository<Supply, Long> {}