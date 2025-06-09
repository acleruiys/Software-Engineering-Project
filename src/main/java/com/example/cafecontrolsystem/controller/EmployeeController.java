package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.SaveEmployeeDto;
import com.example.cafecontrolsystem.dto.UpdateAttendanceDto;
import com.example.cafecontrolsystem.dto.UpdateEmployeeDto;
import com.example.cafecontrolsystem.entity.Employee;
import com.example.cafecontrolsystem.entity.EmployeeAttendance;
import com.example.cafecontrolsystem.repository.EmployeeAttendanceRepository;
import com.example.cafecontrolsystem.repository.EmployeeRepository;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final EmployeeAttendanceRepository attendance;

    @Resource(name = "employeeController")
    @Lazy
    EmployeeController self;

    @GetMapping("/list")
    public ResponseEntity<List<Employee>> getEmployees() {
        return ResponseEntity.ok(showEmployee());
    }

    @PostMapping("/add")
    public ResponseEntity<Employee> addEmployee(@RequestBody SaveEmployeeDto saveEmployeeDto) {
        return ResponseEntity.ok(saveEmployee(saveEmployeeDto));
    }

    @PutMapping("/update")
    public ResponseEntity<Employee> updateEmployee(@RequestBody UpdateEmployeeDto updateEmployeeDto) {
        return ResponseEntity.ok(self.updateEmployeeByDto(updateEmployeeDto));
    }

    @DeleteMapping("/delete/{employeeId}")
    public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long employeeId) {
        boolean isDeleted = deleteEmployeeById(employeeId);
        return ResponseEntity.ok(Map.of("success", isDeleted));
    }

    @PostMapping("/clock-in/{employeeId}")
    public ResponseEntity<?> clockIn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(clock_in(employeeId));
    }

    @PostMapping("/clock-out/{employeeId}")
    public ResponseEntity<?> clockOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(self.clock_out(employeeId));
    }




    // 출근 처리
    public EmployeeAttendance clock_in(Long employeeId){
        return attendance.save(EmployeeAttendance.builder()
                .employee(employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new IllegalArgumentException("Error: 출근 처리" + employeeId)))
                .clockIn(LocalTime.now())
                .date(LocalDate.now())
                .build());
    }

    // 퇴근 처리
    @Transactional
    public EmployeeAttendance clock_out(Long employeeId){
        return attendance.findByEmployeeLatest(employeeRepository.findById(employeeId).orElseThrow(() -> new IllegalArgumentException("Error: 퇴근 처리 " + employeeId)))
                .orElseThrow(() -> new IllegalArgumentException("Error: 출근 미처리"))
                .clock_out(LocalTime.now());
    }

    // 근태 기록 수정
    @Transactional
    public EmployeeAttendance updateAttendance(UpdateAttendanceDto updateAttendanceDto){
        attendance.findById(updateAttendanceDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 근태 id " + updateAttendanceDto.getId()))
                .updateAttendance(updateAttendanceDto);

        return attendance.findById(updateAttendanceDto.getId()).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 근태 id" + updateAttendanceDto.getId()));
    }

    // 전체 조회
    // pageSize = 10
    public List<EmployeeAttendance> showAttendance(int page){
        return attendance.findAll(PageRequest.of(page, 10, Sort.by("date").descending().and(Sort.by("id").descending())))
                .getContent();
    }

    // 직원 별 근무 조회
    // pageSize = 10
    public List<EmployeeAttendance> showAttendanceByEmployee(Long employeeId, int page){
        return attendance.findByEmployee(employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 회원 " + employeeId)),
                        PageRequest.of(page, 10, Sort.by("date").descending().and(Sort.by("id").descending())))
                .orElseThrow(() -> new IllegalArgumentException("Error: 근태 기록 없음")).getContent();
    }

    // 직원 가입
    public Employee saveEmployee(SaveEmployeeDto saveEmployeeDto){
        return employeeRepository.save(Employee.builder()
                .name(saveEmployeeDto.getName())
                .position("part_time")
                .salary(10030)
                .build());
    }

    // 직원 정보 수정
    @Transactional
    public Employee updateEmployeeByDto(UpdateEmployeeDto updateEmployeeDto){
        employeeRepository.findById(updateEmployeeDto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 직원 " + updateEmployeeDto.getEmployeeId()))
                .updateEmployee(updateEmployeeDto);

        return employeeRepository.findById(updateEmployeeDto.getEmployeeId())
                .orElseThrow(() -> new IllegalStateException("Error: 직원 수정 중 오류 " + updateEmployeeDto.getEmployeeId()));
    }

    // 직원 삭제
    public boolean deleteEmployeeById(Long employId){
        employeeRepository.deleteById(employId);

        return employeeRepository.findById(employId).isEmpty();
    }

    // 직원 전체 조회
    public List<Employee> showEmployee(){
        return employeeRepository.findAll();
    }
} 