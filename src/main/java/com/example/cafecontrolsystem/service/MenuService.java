package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuRepository menuRepository;

    public List<Menu> getMenusByCategory(String category) {
        return menuRepository.findByCategoryNameAndStatus(category, Menu.MenuStatus.AVAILABLE);
    }
} 