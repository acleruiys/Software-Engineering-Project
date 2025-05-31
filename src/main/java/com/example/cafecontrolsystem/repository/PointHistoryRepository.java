package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.PointHistory;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {
}
