package com.example.cafecontrolsystem.dto;

import com.example.cafecontrolsystem.entity.Menu_entity;
import lombok.Getter;

import java.util.List;

@Getter
public class SaveSaleDto {

    private Long memberId;
    private List<SaleItemDto> menus;
    private List<SalePaymentDto> payments;
    private Integer totalPrice;
}
