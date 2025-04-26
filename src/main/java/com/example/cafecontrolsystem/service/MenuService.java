package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.MenuCategory;
import com.example.cafecontrolsystem.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {
    
    @Autowired
    private MenuRepository menuRepository;
    
    public List<Menu> getMenusByCategory(MenuCategory category) {
        return menuRepository.findByCategory(category);
    }
    
    public List<Menu> getAllAvailableMenus() {
        return menuRepository.findByAvailableTrue();
    }
    
    public Menu saveMenu(Menu menu) {
        return menuRepository.save(menu);
    }
    
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
} 