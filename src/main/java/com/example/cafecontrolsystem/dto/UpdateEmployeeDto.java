package com.example.cafecontrolsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeDto {
    private Long employeeId;
    private String name;
    private String position;
    private Integer salary;
}
