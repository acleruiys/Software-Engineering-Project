package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.MenuDto;
import com.example.cafecontrolsystem.dto.UpdateMenuDto;
import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.repository.MenuRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    public List<Menu_entity> getMenusByCategory(String category) {
        return menuRepository.findByCategory(category);
    }

    public List<Menu_entity> getAllAvailableMenus() {
        return menuRepository.findByAvailableTrue();
    }

    public Menu_entity getMenu(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " + id));
    }

    public Menu_entity getMenuByName(String name) {
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

    public Menu_entity saveMenu(Menu_entity menuEntity) {
        return menuRepository.save(menuEntity);
    }

    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }

    public Menu_entity createMenuFromDto(MenuDto dto) {
        Menu_entity menu = new Menu_entity();
        menu.setName(dto.getName());
        menu.setPrice(dto.getPrice());
        menu.setAvailable(dto.getStatus().equals("판매중"));
        menu.setCategory(dto.getCategory());
        
        return menu;
    }
} 