package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "inventory_category")
public class Inventory_category_entity {
    @Id
    @GeneratedValue(generator = "inventory_category_seq")
    private Long id; // 재고 카테고리 ID

    @Column(nullable = false)
    private String name; // 재고 카테고리 이름
}
