package com.example.cafecontrolsystem.dto;

import lombok.Getter;

import java.util.Collections;
import java.util.List;

@Getter
public class SaleItemDto {
    private Long menuId;
    private Integer quantity;
    private Integer price;
    private List<Long> optionId;
}
