package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "menus")
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private int price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private CategoryType category;
    
    @Column(length = 500)
    private String description;
    
    private boolean available = true;
} 