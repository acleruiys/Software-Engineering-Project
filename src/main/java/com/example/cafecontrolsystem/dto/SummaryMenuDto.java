package com.example.cafecontrolsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public class SummaryMenuDto {
    private String menu;
    private Long totalPrice;
    private Long totalQuantity;

}
