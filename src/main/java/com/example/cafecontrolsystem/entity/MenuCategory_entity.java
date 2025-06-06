package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "menu_categories")
public class MenuCategory_entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id; // 카테고리 ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CategoryType type;

    @Column(nullable = false)
    private String name; // 카테고리 이름

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryStatus status = CategoryStatus.ACTIVE;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Menu_entity> menuEntities = new ArrayList<>();

    public enum CategoryStatus {
        ACTIVE, INACTIVE
    }
} 