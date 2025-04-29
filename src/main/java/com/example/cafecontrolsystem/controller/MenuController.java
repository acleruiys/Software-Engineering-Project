package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping
    public ResponseEntity<List<Menu_entity>> getMenusByCategory(@RequestParam(required = false) CategoryType category) {
        if (category != null) {
            return ResponseEntity.ok(menuService.getMenusByCategory(category));
        }
        return ResponseEntity.ok(menuService.getAllAvailableMenus());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Menu_entity> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenu(id));
    }
    
    @PostMapping
    public ResponseEntity<Menu_entity> addMenu(@RequestBody Menu_entity menuEntity) {
        return ResponseEntity.ok(menuService.saveMenu(menuEntity));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Menu_entity> updateMenu(@PathVariable Long id, @RequestBody Menu_entity menuEntity) {
        menuEntity.setId(id);
        return ResponseEntity.ok(menuService.saveMenu(menuEntity));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.ok().build();
    }
} 