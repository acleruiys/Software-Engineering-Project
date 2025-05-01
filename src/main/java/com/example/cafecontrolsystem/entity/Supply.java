package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "supply")
@Getter @Setter
public class Supply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String name;
    
    private String manager;
    
    private String phone;
    
    @OneToMany(mappedBy = "supply", cascade = CascadeType.ALL)
    private List<Inventory_entitiy> inventoryItems = new ArrayList<>();
} 