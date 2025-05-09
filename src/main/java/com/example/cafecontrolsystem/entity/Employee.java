package com.example.cafecontrolsystem.entity;

import com.example.cafecontrolsystem.dto.UpdateEmployeeDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employee")
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long employeeId;

    private String name;

    private String position;

    private Integer salary;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<EmployeeAttendance> attendances = new ArrayList<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<InventoryHistory> inventoryHistories = new ArrayList<>();

    public void updateEmployee(UpdateEmployeeDto updateEmployeeDto){
        this.name = updateEmployeeDto.getName();
        this.salary = updateEmployeeDto.getSalary();
        this.position = updateEmployeeDto.getPosition();
    }
}