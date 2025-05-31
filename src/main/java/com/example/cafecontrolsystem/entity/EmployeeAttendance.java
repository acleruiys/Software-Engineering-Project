package com.example.cafecontrolsystem.entity;

import com.example.cafecontrolsystem.dto.UpdateAttendanceDto;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "employee_attendance")
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeAttendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "clock_in")
    private LocalTime clockIn;

    @Column(name = "clock_out")
    private LocalTime clockOut;

    @Column(name = "work_hour", precision = 2, scale = 1)
    private BigDecimal workHour;

    @Column(name = "record_date")
    private LocalDate date;

    // 퇴근 처리 시
    public EmployeeAttendance clock_out(LocalTime time){
        this.clockOut = time;
        this.workHour = getWorkhour(this.clockIn, this.clockOut);

        return this;
    }

    // 수정 시
    public void updateAttendance(UpdateAttendanceDto updateAttendanceDto){
        this.clockIn = updateAttendanceDto.getClockIn();
        this.clockOut = updateAttendanceDto.getClockOut();
        this.date = updateAttendanceDto.getDate();
        this.workHour = getWorkhour(clockIn, clockOut);
    }

    // clockIn과 clockOut으로 workHour 계산 -> decimal로
    public BigDecimal getWorkhour(LocalTime start, LocalTime end){
        return BigDecimal.valueOf(Duration.between(start, end).getSeconds())
                .divide(BigDecimal.valueOf(3600), 1, RoundingMode.HALF_UP);
    }
} 