// 메뉴 관련 기능은 MenuController로 이동했으므로 이 컨트롤러는 더 이상 사용하지 않습니다.
/*
package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MainController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/menus")
    public List<Menu> getMenusByCategory(@RequestParam(required = false) CategoryType category) {
        if (category != null) {
            // 카테고리를 기준으로 필터된 메뉴 가져오기
            return menuService.getMenusByCategory(category);
        }
        // 모든 메뉴 가져오기
        return menuService.getAllAvailableMenus();
    }
    // 메뉴 추가 API
    @PostMapping("/menus")
    public Menu addMenu(@RequestBody Menu menu) {
        return menuService.saveMenu(menu);
    }

    // 메뉴 삭제 API
    @DeleteMapping("/menus/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
    }
}
*/