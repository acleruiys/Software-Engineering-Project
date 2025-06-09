package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long id; // 재고 ID

    @Column(nullable = false)
    private String name; // 재고 품목 이름

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private InventoryCategory category; // 재고 카테고리 ID
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supply_id")
    private Supply supply; // 공급업체 ID

    @Column(nullable = false)
    private int price; // 재고 품목 가격

    @Column(nullable = false)
    private int quantity; // 재고 품목 수량
}
