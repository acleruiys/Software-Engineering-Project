package com.example.cafecontrolsystem.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class SaleItemDto {

    private Long menuId;

    private Integer quantity;

    private Integer price;

    private List<Long> optionId;
}
