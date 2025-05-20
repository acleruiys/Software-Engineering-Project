package com.example.소공프로젝트.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private InventoryCategory category;

    @ManyToOne
    @JoinColumn(name = "supply_id")
    private Supply supply;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int quantity;
}