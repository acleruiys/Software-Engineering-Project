package com.example.cafecontrolsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public class SummaryPaymentDto {
    private String method;
    private Long methodPerPrice;
}