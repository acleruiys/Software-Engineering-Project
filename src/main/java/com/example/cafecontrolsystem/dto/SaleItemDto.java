package com.example.cafecontrolsystem.dto;

import lombok.Getter;

import java.util.Collections;
import java.util.List;

@Getter
public class SaleItemDto {
    private Long menuId;
    private Integer quantity;
    private Integer price;

    // 옵션이 여러가지일 때의 처리
    private List<Long> optionId;
}
