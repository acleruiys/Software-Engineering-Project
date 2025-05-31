package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.SaveEmployeeDto;
import com.example.cafecontrolsystem.dto.UpdateEmployeeDto;
import com.example.cafecontrolsystem.entity.Employee;
import com.example.cafecontrolsystem.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/list")
    public ResponseEntity<List<Employee>> getEmployees() {
        return ResponseEntity.ok(employeeService.showEmployee());
    }

    @PostMapping("/add")
    public ResponseEntity<Employee> addEmployee(@RequestBody SaveEmployeeDto saveEmployeeDto) {
        return ResponseEntity.ok(employeeService.saveEmployee(saveEmployeeDto));
    }

    @PutMapping("/update")
    public ResponseEntity<Employee> updateEmployee(@RequestBody UpdateEmployeeDto updateEmployeeDto) {
        return ResponseEntity.ok(employeeService.updateEmployee(updateEmployeeDto));
    }

    @DeleteMapping("/delete/{employeeId}")
    public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long employeeId) {
        boolean isDeleted = employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok(Map.of("success", isDeleted));
    }

    @PostMapping("/clock-in/{employeeId}")
    public ResponseEntity<?> clockIn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(employeeService.clock_in(employeeId));
    }

    @PostMapping("/clock-out/{employeeId}")
    public ResponseEntity<?> clockOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(employeeService.clock_out(employeeId));
    }
} 