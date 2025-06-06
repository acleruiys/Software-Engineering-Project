package com.example.cafecontrolsystem.dto;

import com.example.cafecontrolsystem.service.PaymentMethod;
import lombok.Getter;

@Getter
public class SalePaymentDto {
    private PaymentMethod payment;
    private Integer price;
}
