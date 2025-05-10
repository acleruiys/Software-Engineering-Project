package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.entity.MenuCategory_entity;
import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.repository.CategoryRepository;
import com.example.cafecontrolsystem.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(3)
public class MenuInitializer implements CommandLineRunner {

    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (menuRepository.count() == 0) {
            initializeMenus();
        }
    }

    private void initializeMenus() {
        for (MenuType type : MenuType.values()) {
            menuRepository.save(Menu_entity.builder()
                    .name(type.name())
                    .price(type.getPrice())
                    .category(categoryRepository.findById(type.getCategory_id())
                            .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 카테고리 " + type.getCategory_id())))
                    .available(true)
                    .build());
        }
    }
}
