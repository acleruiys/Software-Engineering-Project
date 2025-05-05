package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.SaveEmployeeDto;
import com.example.cafecontrolsystem.dto.UpdateEmployeeDto;
import com.example.cafecontrolsystem.entity.Employee;
import com.example.cafecontrolsystem.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public Employee saveEmployee(SaveEmployeeDto saveEmployeeDto){
        return employeeRepository.save(Employee.builder()
                .name(saveEmployeeDto.getName())
                .position("part_time")
                .salary(10030)
                .build());
    }

    @Transactional
    public Employee updateEmployee(UpdateEmployeeDto updateEmployeeDto){
        employeeRepository.findById(updateEmployeeDto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 직원 " + updateEmployeeDto.getEmployeeId()))
                .updateEmployee(updateEmployeeDto);

        return employeeRepository.findById(updateEmployeeDto.getEmployeeId())
                .orElseThrow(() -> new IllegalStateException("Error: 직원 수정 중 오류 " + updateEmployeeDto.getEmployeeId()));
    }

    public boolean deleteEmployee(Long employId){
        employeeRepository.deleteById(employId);

       return employeeRepository.findById(employId).isEmpty();
    }

    public List<Employee> showEmployee(){
        return employeeRepository.findAll();
    }

}
