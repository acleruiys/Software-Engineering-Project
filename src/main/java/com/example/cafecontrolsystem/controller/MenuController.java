package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-management")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping
    public ResponseEntity<List<Menu>> getMenusByCategory(@RequestParam(required = false) CategoryType category) {
        if (category != null) {
            return ResponseEntity.ok(menuService.getMenusByCategory(category));
        }
        return ResponseEntity.ok(menuService.getAllAvailableMenus());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenu(id));
    }
    
    @PostMapping
    public ResponseEntity<Menu> addMenu(@RequestBody Menu menu) {
        return ResponseEntity.ok(menuService.saveMenu(menu));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        menu.setId(id);
        return ResponseEntity.ok(menuService.saveMenu(menu));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.ok().build();
    }
} 