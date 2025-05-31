package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.MenuOption;
import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.repository.OptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2)
public class OptionInitailizer implements CommandLineRunner {

    private final OptionRepository optionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (optionRepository.count() == 0) {
            initializeMenus();
        }
    }

    private void initializeMenus() {
        for (OptionType type : OptionType.values()) {
            optionRepository.save(MenuOption.builder()
                    .name(type.name())
                    .price(type.getPrice())
                    .available(true)
                    .build());
        }
    }
}
