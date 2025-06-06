package com.example.cafecontrolsystem.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class SaleSummaryDateDto {

    @Schema(description = "시작 날짜", example = "2025-06-06T00:00:00.0Z")
    private LocalDateTime startDate;

    @Schema(description = "종료 날짜", example = "2025-06-06T23:59:59.0Z")
    private LocalDateTime endDate;
}

