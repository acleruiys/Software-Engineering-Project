package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "daily_sale")
@Getter @Setter
public class DailySale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    
    private Integer cash;
    
    private Integer card;
    
    private Integer point;
} 