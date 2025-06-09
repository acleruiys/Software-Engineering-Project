package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "inventory_category")
public class InventoryCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 재고 카테고리 ID

    @Column(nullable = false)
    private String name; // 재고 카테고리 이름
}
