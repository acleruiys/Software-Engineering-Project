package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "sale_items")
@Getter
@Setter
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_item_id")
    private Long id; // 판매 품목 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale; // 판매 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu_entity menuEntity; // 메뉴 ID

    @Column(nullable = false)
    private Integer quantity; // 판매 품목 수량

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice; // 판매 품목 단가

    private BigDecimal discount = BigDecimal.ZERO; // 판매 품목 할인

    @Column(nullable = false)
    private BigDecimal subtotal; // 판매 품목 소계
} 