package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.MenuDto;
import com.example.cafecontrolsystem.dto.UpdateMenuDto;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.repository.MenuRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    @GetMapping
    public ResponseEntity<List<MenuDto>> getMenus() {
        List<Menu> menus;
        menus = getAllAvailableMenus();

        List<MenuDto> menuDtos = menus.stream()
                .map(this::convertToMenuDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(menuDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDto> getMenu(@PathVariable Long id) {
        Menu menu = getMenuById(id);
        return ResponseEntity.ok(convertToMenuDto(menu));
    }

    @PostMapping
    public ResponseEntity<MenuDto> addMenu(@RequestBody MenuDto menuDto) {
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
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
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


    public List<Menu> getMenusByCategory(CategoryType categoryType) {
        return menuRepository.findByCategory(categoryType.getDisplayName());
    }

    public List<Menu> getAllAvailableMenus() {
        return menuRepository.findByAvailableTrue();
    }

    public Menu getMenuById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " + id));
    }

    public Menu getMenuByName(String name) {
        return menuRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " + name));
    }

    // 가격 및 설명 변경 -> 이름으로 찾을지 id로 찾을지 회의 필요
    @Transactional
    public void changeMenu(UpdateMenuDto updateMenuDto){
        menuRepository.findByName(updateMenuDto.getName()).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 메뉴 " + updateMenuDto.getName()))
                .changeMenu(updateMenuDto);
    }

    // 허용 여부 변경
    @Transactional
    public void changeAvailable(String name){
        menuRepository.findByName(name).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 메뉴 " + name))
                .changeAvailable();
    }

    public Menu saveMenu(Menu menuEntity) {
        return menuRepository.save(menuEntity);
    }

    public void deleteMenuById(Long id) {
        menuRepository.deleteById(id);
    }

} 