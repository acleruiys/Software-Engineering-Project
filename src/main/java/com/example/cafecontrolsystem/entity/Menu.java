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
    
    private String name;
    private int price;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private MenuCategory category;
    
    private String description;
    private boolean available;
} 