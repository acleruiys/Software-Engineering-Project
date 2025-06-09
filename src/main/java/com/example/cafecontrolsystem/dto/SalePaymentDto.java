package com.example.cafecontrolsystem.dto;

import com.example.cafecontrolsystem.controller.PaymentMethod;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SalePaymentDto {
    private PaymentMethod payment;

    private Integer price;
}
