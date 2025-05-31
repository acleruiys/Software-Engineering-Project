package com.example.cafecontrolsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAttendanceDto {
    private Long id;
    private LocalTime clockIn;
    private LocalTime clockOut;
    private LocalDate date;
}
