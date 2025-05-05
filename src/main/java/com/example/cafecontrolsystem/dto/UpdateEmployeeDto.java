package com.example.cafecontrolsystem.dto;

import lombok.Getter;

@Getter
public class UpdateEmployeeDto {
    private Long employeeId;

    private String name;

    private String position;

    private Integer salary;
}
