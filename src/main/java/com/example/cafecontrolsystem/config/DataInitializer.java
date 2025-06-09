package com.example.cafecontrolsystem.config;

import com.example.cafecontrolsystem.entity.Menu;
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
                Menu americano = Menu.builder()
                        .name("아메리카노")
                        .price(3000)
                        .category(CategoryType.커피.name())
                        .available(true)
                        .build();
                
                Menu latte = Menu.builder()
                        .name("카페라떼")
                        .price(5500)
                        .category(CategoryType.커피.name())
                        .available(true)
                        .build();
                
                Menu cappuccino = Menu.builder()
                        .name("카푸치노")
                        .price(5500)
                        .category(CategoryType.커피.name())
                        .available(true)
                        .build();
                
                // 디카페인 메뉴 추가
                Menu decafAmericano = Menu.builder()
                        .name("디카페인 아메리카노")
                        .price(3500)
                        .category(CategoryType.디카페인.name())
                        .available(true)
                        .build();
                
                Menu decafLatte = Menu.builder()
                        .name("디카페인 카페라떼")
                        .price(6000)
                        .category(CategoryType.디카페인.name())
                        .available(true)
                        .build();
                
                // 논커피 메뉴 추가
                Menu strawberryLatte = Menu.builder()
                        .name("딸기라떼")
                        .price(6000)
                        .category(CategoryType.논커피.name())
                        .available(true)
                        .build();
                
                Menu chocolateLatte = Menu.builder()
                        .name("초코라떼")
                        .price(5500)
                        .category(CategoryType.논커피.name())
                        .available(true)
                        .build();
                
                // 티 메뉴 추가
                Menu greenTea = Menu.builder()
                        .name("녹차")
                        .price(5000)
                        .category(CategoryType.TEA.name())
                        .available(true)
                        .build();
                
                Menu blackTea = Menu.builder()
                        .name("홍차")
                        .price(5000)
                        .category(CategoryType.TEA.name())
                        .available(true)
                        .build();
                
                // 스무디 메뉴 추가
                Menu strawberrySmoothie = Menu.builder()
                        .name("딸기스무디")
                        .price(6500)
                        .category(CategoryType.SMOOTHIE.name())
                        .available(true)
                        .build();
                
                Menu mangoSmoothie = Menu.builder()
                        .name("망고스무디")
                        .price(6500)
                        .category(CategoryType.SMOOTHIE.name())
                        .available(true)
                        .build();
                
                // 에이드 메뉴 추가
                Menu lemonAde = Menu.builder()
                        .name("레몬에이드")
                        .price(6000)
                        .category(CategoryType.ADE.name())
                        .available(true)
                        .build();
                
                Menu grapefruitAde = Menu.builder()
                        .name("자몽에이드")
                        .price(6000)
                        .category(CategoryType.ADE.name())
                        .available(true)
                        .build();
                
                // 모든 메뉴 저장
                List<Menu> initialMenus = Arrays.asList(
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