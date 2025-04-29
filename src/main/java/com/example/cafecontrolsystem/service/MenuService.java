package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {
    
    @Autowired
    private MenuRepository menuRepository;
    
    public List<Menu_entity> getMenusByCategory(CategoryType categoryType) {
        return menuRepository.findByCategoryType(categoryType);
    }
    
    public List<Menu_entity> getAllAvailableMenus() {
        return menuRepository.findByAvailableTrue();
    }
    
    public Menu_entity getMenu(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " + id));
    }
    
    public Menu_entity saveMenu(Menu_entity menuEntity) {
        return menuRepository.save(menuEntity);
    }
    
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
} 