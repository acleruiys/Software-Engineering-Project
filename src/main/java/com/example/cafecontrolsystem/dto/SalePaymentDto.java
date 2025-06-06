package com.example.cafecontrolsystem.dto;

import com.example.cafecontrolsystem.service.PaymentMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SalePaymentDto {
    private PaymentMethod payment;

    private Integer price;
}
