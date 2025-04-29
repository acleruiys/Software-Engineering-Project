package com.example.cafecontrolsystem.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
@Table(name = "inventory_category")
public class Inventory_category_entity {
    @Id
    @GeneratedValue(generator = "inventory_category_seq")
    private Long id; // 재고 카테고리 ID

    @
}
