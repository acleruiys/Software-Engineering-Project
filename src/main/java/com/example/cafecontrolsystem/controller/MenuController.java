package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.MenuDto;
import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menus")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMenus(@RequestParam(required = false) String category) {
        List<Menu_entity> menus;
        if (category != null) {
            menus = menuService.getMenusByCategory(category);
        } else {
            menus = menuService.getAllAvailableMenus();
        }
        
        List<Map<String, Object>> menuItems = menus.stream()
            .map(this::convertToMenuMap)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MenuDto> getMenu(@PathVariable Long id) {
        Menu_entity menu = menuService.getMenu(id);
        return ResponseEntity.ok(convertToMenuDto(menu));
    }
    
    @PostMapping
    public ResponseEntity<MenuDto> addMenu(@RequestBody MenuDto menuDto) {
        Menu_entity menu = convertToMenuEntity(menuDto);
        Menu_entity savedMenu = menuService.saveMenu(menu);
        return ResponseEntity.ok(convertToMenuDto(savedMenu));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MenuDto> updateMenu(@PathVariable Long id, @RequestBody MenuDto menuDto) {
        Menu_entity menu = convertToMenuEntity(menuDto);
        menu.setId(id);
        Menu_entity updatedMenu = menuService.saveMenu(menu);
        return ResponseEntity.ok(convertToMenuDto(updatedMenu));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.ok().build();
    }
    
    // 메뉴 엔티티를 Map으로 변환 (클라이언트 요구 형식)
    private Map<String, Object> convertToMenuMap(Menu_entity menu) {
        Map<String, Object> menuMap = new HashMap<>();
        menuMap.put("id", menu.getId().toString());
        menuMap.put("name", menu.getName());
        menuMap.put("price", menu.getPrice());
        menuMap.put("category", menu.getCategory());
        menuMap.put("status", menu.isAvailable() ? "판매중" : "품절");
        return menuMap;
    }
    
    // 메뉴 엔티티를 DTO로 변환
    private MenuDto convertToMenuDto(Menu_entity menu) {
        MenuDto dto = new MenuDto();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setPrice(menu.getPrice());
        dto.setCategory(menu.getCategory());
        dto.setStatus(menu.isAvailable() ? "판매중" : "품절");
        return dto;
    }
    
    // DTO를 메뉴 엔티티로 변환 - 카테고리 처리는 서비스에서 처리
    private Menu_entity convertToMenuEntity(MenuDto dto) {
        return menuService.createMenuFromDto(dto);
    }
} 