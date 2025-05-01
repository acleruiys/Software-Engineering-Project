package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employee")
@Getter @Setter
public class Employee {
    @Id
    @Column(name = "employee_id")
    private Long employeeId;
    
    private String name;
    
    private String position;
    
    private Integer salary;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<EmployeeAttendance> attendances = new ArrayList<>();
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<InventoryHistory> inventoryHistories = new ArrayList<>();
} 