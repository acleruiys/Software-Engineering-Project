package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "employee_attendance")
@Getter @Setter
public class EmployeeAttendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @Column(name = "clock_in")
    private LocalTime clockIn;
    
    @Column(name = "clock_out")
    private LocalTime clockOut;
    
    @Column(name = "work_hour", precision = 4, scale = 2)
    private BigDecimal workHour;
    
    private LocalDate date;
} 