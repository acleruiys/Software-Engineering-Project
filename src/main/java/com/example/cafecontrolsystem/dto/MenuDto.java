package com.example.cafecontrolsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuDto {
    private Long id;
    private String name;
    private String category;
    private int price;
    private String status;
} 