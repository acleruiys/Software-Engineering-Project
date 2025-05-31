package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "payment")
@Getter @Setter
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private Sale sale;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "method_id")
    private PaymentMethod method;
    
    private Integer price;
} 