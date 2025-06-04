package com.example.cafecontrolsystem.dto;

import lombok.Getter;

@Getter
public class SalePaymentDto {
    private Long paymentId;
    private String payment; // 결제 방법 (POINT, CARD, CASH 등)
    private Integer price;
}
