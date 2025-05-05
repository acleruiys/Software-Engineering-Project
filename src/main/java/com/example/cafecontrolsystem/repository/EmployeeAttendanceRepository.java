package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.Employee;
import com.example.cafecontrolsystem.entity.EmployeeAttendance;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeAttendanceRepository extends JpaRepository<EmployeeAttendance, Long> {
    public Optional<Page<EmployeeAttendance>> findByEmployee(Employee employee, Pageable pageable);

    @Query("SELECT a FROM EmployeeAttendance a ORDER BY a.id DESC LIMIT 1")
    public Optional<EmployeeAttendance> findByEmployeeLatest(Employee employee);

    public Optional<Page<EmployeeAttendance>> findAll(Pageable pageable);

}
