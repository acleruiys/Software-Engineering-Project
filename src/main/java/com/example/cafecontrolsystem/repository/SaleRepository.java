package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.dto.SummaryPaymentDto;
import com.example.cafecontrolsystem.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("SELECT COUNT(DISTINCT s.member) AS tot FROM Sale AS s " +
            "WHERE s.createdAt BETWEEN :startDate AND :endDate")
    public Integer getTotalmember(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT new com.example.cafecontrolsystem.dto.SummaryPaymentDto(p.method, SUM(p.price)) FROM Payment p " +
            "WHERE EXISTS (" +
            "   SELECT 1 FROM Sale s WHERE s.id = p.sale.id " +
            "   AND s.createdAt BETWEEN :startDate AND :endDate) " +
            "GROUP BY p.method")
    public List<SummaryPaymentDto> findPaymentByDate(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT m.name, d.menuOption, SUM(d.price) AS totalPrice, SUM(d.quantity) AS totalQuantity " +
            "FROM SaleDetail d " +
            "JOIN d.menu m " +
            "WHERE EXISTS (" +
            "   SELECT 1 FROM Sale s WHERE s.id = d.sale.id " +
            "   AND s.createdAt BETWEEN :startDate AND :endDate) " +
            "GROUP BY m.name, d.menuOption")
    public List<Object[]> findSummaryMenuByDate(LocalDateTime startDate, LocalDateTime endDate);
}

