package com.example.cafecontrolsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ShowSaleSummaryDto {
    private Long totalMember;
    private Long totalPrice;
    private List<SummaryMenuDto> menus;
    private List<SummaryPaymentDto> payments;
}

