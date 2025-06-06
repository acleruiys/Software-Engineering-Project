package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.dto.SummaryPaymentDto;
import com.example.cafecontrolsystem.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("SELECT COUNT(*) AS totalMember, SUM(s.totalPrice) AS totalPrice FROM Sale AS s " +
            "WHERE s.createdAt BETWEEN :startDate AND :endDate")
    public List<Object[]> getTotalmember(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT new com.example.cafecontrolsystem.dto.SummaryPaymentDto(p.method, SUM(p.price)) FROM Payment p " +
            "WHERE EXISTS (" +
            "   SELECT 1 FROM Sale s WHERE s.id = p.sale.id " +
            "   AND s.createdAt BETWEEN :startDate AND :endDate) " +
            "GROUP BY p.method")
    public List<SummaryPaymentDto> findPaymentByDate(LocalDateTime startDate, LocalDateTime endDate);


    @Query(value = "SELECT m.name, d.menu_option, m.category, SUM(d.price) AS totalPrice, SUM(d.quantity) AS totalQuantity " +
            "FROM sale_detail d " +
            "INNER JOIN menu_entity m USE INDEX(idx_id_name_category) " +
            "ON d.menu_id = m.id " +
            "WHERE EXISTS (" +
            "   SELECT 1 FROM sale s WHERE s.id = d.sale_id " +
            "   AND s.created_at BETWEEN :startDate AND :endDate) " +
            "GROUP BY m.name, d.menu_option, m.category",
            nativeQuery = true
    )
    public List<Object[]> findSummaryMenuByDate(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}

