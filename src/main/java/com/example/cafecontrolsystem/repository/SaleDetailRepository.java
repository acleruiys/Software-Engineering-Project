package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleDetailRepository extends JpaRepository<SaleDetail, Long> {
}
