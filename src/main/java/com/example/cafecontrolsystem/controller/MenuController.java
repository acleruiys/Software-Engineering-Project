package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.MenuCategory;
import com.example.cafecontrolsystem.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu-management")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping
    public List<Menu> getMenusByCategory(@RequestParam(required = false) MenuCategory category) {
        if (category != null) {
            return menuService.getMenusByCategory(category);
        }
        return menuService.getAllAvailableMenus();
    }
    
    @PostMapping
    public Menu addMenu(@RequestBody Menu menu) {
        return menuService.saveMenu(menu);
    }
    
    @DeleteMapping("/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
    }
} 