package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.Menu_entity;
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

    @Override
    public void run(String... args) throws Exception {
        if (menuRepository.count() == 0) {
            initializeMenus();
        }
    }

    // 초기 카테고리 값 설정 필요
    private void initializeMenus() {
        for (MenuType type : MenuType.values()) {
            menuRepository.save(Menu_entity.builder()
                    .name(type.name())
                    .price(type.getPrice())
                    .category("커피")
                    .available(true)
                    .build());
        }
    }
}
