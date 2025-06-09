package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.MenuDto;
import com.example.cafecontrolsystem.dto.UpdateMenuDto;
import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.repository.MenuRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;


    public List<Menu> getMenusByCategory(CategoryType categoryType) {
        return menuRepository.findByCategory(categoryType.getDisplayName());
    }

    public List<Menu> getAllAvailableMenus() {
        return menuRepository.findByAvailableTrue();
    }

    public Menu getMenu(Long id) {
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

    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }

    public Menu createMenuFromDto(MenuDto dto) {
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
} 