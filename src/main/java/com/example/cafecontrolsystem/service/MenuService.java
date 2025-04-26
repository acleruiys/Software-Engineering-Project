package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {
    
    @Autowired
    private MenuRepository menuRepository;
    
    public List<Menu> getMenusByCategory(CategoryType category) {
        return menuRepository.findByCategory(category);
    }
    
    public List<Menu> getAllAvailableMenus() {
        return menuRepository.findByAvailableTrue();
    }
    
    public Menu getMenu(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " + id));
    }
    
    public Menu saveMenu(Menu menu) {
        return menuRepository.save(menu);
    }
    
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
} 