package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "monthly_expense")
@Getter @Setter
public class MonthlyExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    
    @Column(name = "monthly_fee")
    private Integer monthlyFee;
    
    @Column(name = "additional_fee")
    private Integer additionalFee;
    
    @Column(name = "maintenance_fee")
    private Integer maintenanceFee;
    
    @Column(name = "wage_expense")
    private Integer wageExpense;
    
    @Column(name = "supply_fee")
    private Integer supplyFee;
    
    @Column(name = "monthly_expensecol")
    private String monthlyExpensecol;
} 