package com.example.cafecontrolsystem.config;

import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Autowired
    private MenuRepository menuRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // 기존 데이터가 없을 경우에만 초기화
            if (menuRepository.count() == 0) {
                System.out.println("메뉴 데이터 초기화 시작...");
                
                // 커피 메뉴 추가
                Menu_entity americano = Menu_entity.builder()
                        .name("아메리카노")
                        .price(3000)
                        .category(CategoryType.COFFEE.name())
                        .available(true)
                        .build();
                
                Menu_entity latte = Menu_entity.builder()
                        .name("카페라떼")
                        .price(5500)
                        .category(CategoryType.COFFEE.name())
                        .available(true)
                        .build();
                
                Menu_entity cappuccino = Menu_entity.builder()
                        .name("카푸치노")
                        .price(5500)
                        .category(CategoryType.COFFEE.name())
                        .available(true)
                        .build();
                
                // 디카페인 메뉴 추가
                Menu_entity decafAmericano = Menu_entity.builder()
                        .name("디카페인 아메리카노")
                        .price(3500)
                        .category(CategoryType.DECAF.name())
                        .available(true)
                        .build();
                
                Menu_entity decafLatte = Menu_entity.builder()
                        .name("디카페인 카페라떼")
                        .price(6000)
                        .category(CategoryType.DECAF.name())
                        .available(true)
                        .build();
                
                // 논커피 메뉴 추가
                Menu_entity strawberryLatte = Menu_entity.builder()
                        .name("딸기라떼")
                        .price(6000)
                        .category(CategoryType.NON_COFFEE.name())
                        .available(true)
                        .build();
                
                Menu_entity chocolateLatte = Menu_entity.builder()
                        .name("초코라떼")
                        .price(5500)
                        .category(CategoryType.NON_COFFEE.name())
                        .available(true)
                        .build();
                
                // 티 메뉴 추가
                Menu_entity greenTea = Menu_entity.builder()
                        .name("녹차")
                        .price(5000)
                        .category(CategoryType.TEA.name())
                        .available(true)
                        .build();
                
                Menu_entity blackTea = Menu_entity.builder()
                        .name("홍차")
                        .price(5000)
                        .category(CategoryType.TEA.name())
                        .available(true)
                        .build();
                
                // 스무디 메뉴 추가
                Menu_entity strawberrySmoothie = Menu_entity.builder()
                        .name("딸기스무디")
                        .price(6500)
                        .category(CategoryType.SMOOTHIE.name())
                        .available(true)
                        .build();
                
                Menu_entity mangoSmoothie = Menu_entity.builder()
                        .name("망고스무디")
                        .price(6500)
                        .category(CategoryType.SMOOTHIE.name())
                        .available(true)
                        .build();
                
                // 에이드 메뉴 추가
                Menu_entity lemonAde = Menu_entity.builder()
                        .name("레몬에이드")
                        .price(6000)
                        .category(CategoryType.ADE.name())
                        .available(true)
                        .build();
                
                Menu_entity grapefruitAde = Menu_entity.builder()
                        .name("자몽에이드")
                        .price(6000)
                        .category(CategoryType.ADE.name())
                        .available(true)
                        .build();
                
                // 모든 메뉴 저장
                List<Menu_entity> initialMenus = Arrays.asList(
                        americano, latte, cappuccino,
                        decafAmericano, decafLatte,
                        strawberryLatte, chocolateLatte,
                        greenTea, blackTea,
                        strawberrySmoothie, mangoSmoothie,
                        lemonAde, grapefruitAde
                );
                
                menuRepository.saveAll(initialMenus);
                
                System.out.println("메뉴 데이터 초기화 완료: " + initialMenus.size() + "개 메뉴 추가됨");
            }
        };
    }
} 