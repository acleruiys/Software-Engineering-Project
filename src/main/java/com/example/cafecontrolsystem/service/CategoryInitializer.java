package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.MenuCategory_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class CategoryInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            initializeCategories();
        }
    }

    private void initializeCategories() {
        for (CategoryType type : CategoryType.values()) {
            MenuCategory_entity category = new MenuCategory_entity();
            category.setType(type);
            category.setName(type.getDisplayName());
            category.setDescription(createDescription(type));
            category.setStatus(MenuCategory_entity.CategoryStatus.ACTIVE);
            categoryRepository.save(category);
        }
    }

    private String createDescription(CategoryType type) {
        return switch (type) {
            case COFFEE -> "다양한 원두로 만든 커피 메뉴";
            case DECAF -> "카페인이 제거된 디카페인 커피 메뉴";
            case NON_COFFEE -> "커피가 들어가지 않은 음료와 과일 라떼";
            case TEA -> "다양한 종류의 차 메뉴";
            case SMOOTHIE -> "과일 스무디와 프라페 메뉴";
            case ADE -> "상큼한 에이드와 주스 메뉴";
            case SEASON -> "계절별 특별 메뉴";
            case BREAD -> "갓 구운 빵과 디저트";
        };
    }
} 