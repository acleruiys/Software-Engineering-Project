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
    private Integer totalMember;
    private List<SummaryMenuDto> menus;
    private List<SummaryPaymentDto> payments;
}
