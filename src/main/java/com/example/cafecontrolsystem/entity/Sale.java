package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sale")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    private String state;
    
    @Column(name = "total_price")
    private Integer totalPrice;

    @ManyToOne
    @JoinColumn(name = "member")
    private Member member;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<Payment> payments = new ArrayList<>();
    
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<SaleDetail> saleDetails = new ArrayList<>();
    
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<PointHistory> pointHistories = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 