package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.MenuOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OptionRepository extends JpaRepository<MenuOption, Long> {

    public List<MenuOption> findByAvailableTrue();

    @Query("SELECT o.name FROM MenuOption AS o WHERE o.optionId = :id")
    public Optional<String> findNameById(Long id);
}
