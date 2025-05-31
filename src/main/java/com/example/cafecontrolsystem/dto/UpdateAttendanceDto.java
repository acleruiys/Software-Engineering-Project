package com.example.cafecontrolsystem.dto;

import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class UpdateAttendanceDto {

    private Long id;

    private LocalTime clockIn;

    private LocalTime clockOut;

    private LocalDate date;
}
