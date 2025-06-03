package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.MenuOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<MenuOption, Long> {

    public List<MenuOption> findByAvailableTrue();
}
