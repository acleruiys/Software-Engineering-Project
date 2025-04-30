package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "inventory")
public class Inventory_entitiy {
    @Id
    @GeneratedValue(generator = "inventory_seq")
    private Long id; // 재고 ID

    @Column(nullable = false)
    private String name; // 재고 품목 이름

    @Column(nullable = false)
    private int price; // 재고 품목 가격

    @Column(nullable = false)
    private int quantity; // 재고 품목 수량
}
