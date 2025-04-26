package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<Menu>> getMenusByCategory(@RequestParam String category) {
        List<Menu> menus = menuService.getMenusByCategory(category);
        return ResponseEntity.ok(menus);
    }
} 