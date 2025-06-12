package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.MenuDto;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;



    @GetMapping()
    public ResponseEntity<List<MenuDto>> getMenus(@RequestParam(required = false, name = "category") String category) {
        List<MenuDto> menuDtos = new ArrayList<>();


        if(category == null || category.isEmpty()) {
            menuDtos = getAllAvailableMenus().stream()
                    .map(this::convertToMenuDto)
                    .toList();
        }
        else{
            try {
                CategoryType categoryType = CategoryType.valueOf(category.toUpperCase());
                menuDtos = getMenusByCategory(categoryType).stream().map(this::convertToMenuDto).toList();
            }
            catch(IllegalArgumentException e){
                throw new IllegalArgumentException("Error: 사용하지 않는 카테고리입니다" + category.toUpperCase());
            }
        }
        return ResponseEntity.ok(menuDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDto> getMenu(@PathVariable Long id) {
        Menu menu = getMenuById(id);
        return ResponseEntity.ok(convertToMenuDto(menu));
    }

    @PostMapping
    public ResponseEntity<MenuDto> addMenuEntity(@RequestBody MenuDto menuDto) {
        if(menuRepository.findByName(menuDto.getName()).isPresent()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Menu menu = convertToMenuEntity(menuDto);
        Menu savedMenu = saveMenu(menu);
        return ResponseEntity.ok(convertToMenuDto(savedMenu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuDto> updateMenu(@PathVariable Long id, @RequestBody MenuDto menuDto) {
        Menu menu = convertToMenuEntity(menuDto);
        menu.setId(id);
        Menu updatedMenu = saveMenu(menu);
        return ResponseEntity.ok(convertToMenuDto(updatedMenu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable(name = "id") Long id) {
        deleteMenuById(id);
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


    private Menu convertToMenuEntity(MenuDto dto) {
        try{
            Menu menu = new Menu();
            menu.setName(dto.getName());
            menu.setPrice(dto.getPrice());
            menu.setAvailable(dto.getStatus().equals("판매중"));
            CategoryType categoryType = CategoryType.fromDisplayName(dto.getCategory());
            menu.setCategory(categoryType.getDisplayName());
            return menu;
        }
        catch (Exception e){
            throw new IllegalArgumentException(e.getMessage());
        }
    }


    public List<Menu> getMenusByCategory(CategoryType category) {

        return menuRepository.findByCategory(category.getDisplayName());
    }

    public List<Menu> getAllAvailableMenus() {
        return menuRepository.findByAvailableTrue();
    }

    public Menu getMenuById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " + id));
    }

    public Menu saveMenu(Menu menuEntity) {
        return menuRepository.save(menuEntity);
    }

    public void deleteMenuById(Long id) {
        menuRepository.deleteById(id);
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<String> IllegalArgument(IllegalArgumentException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
} 
