package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sale_detail")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SaleDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    private Menu_entity menu;

    private Integer quantity;

    private Integer price;

    private String option;
} 