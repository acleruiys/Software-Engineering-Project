package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.MenuDto;
import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuDto>> getMenus() {
        List<Menu> menus;
        menus = menuService.getAllAvailableMenus();

        List<MenuDto> menuDtos = menus.stream()
                .map(this::convertToMenuDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(menuDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDto> getMenu(@PathVariable Long id) {
        Menu menu = menuService.getMenu(id);
        return ResponseEntity.ok(convertToMenuDto(menu));
    }

    @PostMapping
    public ResponseEntity<MenuDto> addMenu(@RequestBody MenuDto menuDto) {
        Menu menu = convertToMenuEntity(menuDto);
        Menu savedMenu = menuService.saveMenu(menu);
        return ResponseEntity.ok(convertToMenuDto(savedMenu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuDto> updateMenu(@PathVariable Long id, @RequestBody MenuDto menuDto) {
        Menu menu = convertToMenuEntity(menuDto);
        menu.setId(id);
        Menu updatedMenu = menuService.saveMenu(menu);
        return ResponseEntity.ok(convertToMenuDto(updatedMenu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.ok().build();
    }

    // 메뉴 엔티티를 DTO로 변환
    private MenuDto convertToMenuDto(Menu menu) {
        MenuDto dto = new MenuDto();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setPrice(menu.getPrice());
        dto.setCategory(menu.getCategory());
        dto.setStatus(menu.isAvailable() ? "판매중" : "품절");
        return dto;
    }

    // DTO를 메뉴 엔티티로 변환 - 카테고리 처리는 서비스에서 처리
    private Menu convertToMenuEntity(MenuDto dto) {
        return menuService.createMenuFromDto(dto);
    }
} 