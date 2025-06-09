package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.Menu;
import com.example.cafecontrolsystem.entity.MenuCategory;
import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.repository.MenuRepository;
import com.example.cafecontrolsystem.repository.MenuCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

@Service
public class MenuDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MenuDataInitializer.class);

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("MenuDataInitializer 시작");
        
        long menuCount = menuRepository.count();
        long categoryCount = menuCategoryRepository.count();
        
        logger.info("현재 메뉴 개수: {}, 카테고리 개수: {}", menuCount, categoryCount);
        
        // 카테고리가 없으면 초기화
        if (categoryCount == 0) {
            logger.info("카테고리 초기화 시작");
            initializeCategories();
            logger.info("카테고리 초기화 완료");
        }
        
        if(menuCount == 0) {
            logger.info("메뉴 초기화 시작");
            initializeMenus();
            logger.info("메뉴 초기화 완료");
        }
        
        logger.info("MenuDataInitializer 완료");
    }

    private void initializeCategories() {
        for (CategoryType categoryType : CategoryType.values()) {
            try {
                if (!menuCategoryRepository.findByType(categoryType).isPresent()) {
                    MenuCategory category = new MenuCategory();
                    category.setType(categoryType);
                    category.setName(categoryType.getDisplayName());
                    category.setStatus(MenuCategory.CategoryStatus.ACTIVE);
                    menuCategoryRepository.save(category);
                    logger.info("카테고리 생성: {} - {}", categoryType.name(), categoryType.getDisplayName());
                }
            } catch (Exception e) {
                logger.error("카테고리 생성 실패: {} - {}", categoryType.name(), e.getMessage());
            }
        }
    }

    private void initializeMenus() {
        // 커피
        createMenusForCategory(CategoryType.COFFEE, Arrays.asList(
            new MenuData("아메리카노", 3000),
            new MenuData("카페라떼", 5500),
            new MenuData("카푸치노", 5500),
            new MenuData("바닐라라떼", 5800),
            new MenuData("카라멜 마키아또", 5800),
            new MenuData("에스프레소", 2800),
            new MenuData("콜드브루", 5000),
            new MenuData("더치커피", 4800),
            new MenuData("헤이즐넛라떼", 5800)
        ));

        // 디카페인
        createMenusForCategory(CategoryType.DECAF, Arrays.asList(
            new MenuData("디카페인 아메리카노", 3500),
            new MenuData("디카페인 카페라떼", 6000),
            new MenuData("디카페인 바닐라라떼", 6300)
        ));

        // 논커피/과일라떼
        createMenusForCategory(CategoryType.NON_COFFEE, Arrays.asList(
            new MenuData("딸기라떼", 6000),
            new MenuData("바나나라떼", 6000),
            new MenuData("초코라떼", 5500),
            new MenuData("녹차라떼", 5500),
            new MenuData("고구마라떼", 6000)
        ));

        // 티
        createMenusForCategory(CategoryType.TEA, Arrays.asList(
            new MenuData("녹차", 5000),
            new MenuData("홍차", 5000),
            new MenuData("캐모마일", 5000),
            new MenuData("페퍼민트", 5000),
            new MenuData("자스민티", 5000),
            new MenuData("얼그레이", 5000)
        ));

        // 스무디/프라페
        createMenusForCategory(CategoryType.SMOOTHIE, Arrays.asList(
            new MenuData("망고스무디", 6500),
            new MenuData("딸기스무디", 6500),
            new MenuData("블루베리스무디", 6500),
            new MenuData("요거트스무디", 6000),
            new MenuData("그린티프라페", 6300),
            new MenuData("초코프라페", 6300)
        ));

        // 에이드/주스
        createMenusForCategory(CategoryType.ADE, Arrays.asList(
            new MenuData("레몬에이드", 6000),
            new MenuData("자몽에이드", 6000),
            new MenuData("청포도에이드", 6000),
            new MenuData("오렌지주스", 5500),
            new MenuData("자몽주스", 5500)
        ));

        // 시즌메뉴
        createMenusForCategory(CategoryType.SEASON, Arrays.asList(
            new MenuData("겨울한정 핫초코", 5500),
            new MenuData("토피넛라떼", 6300),
            new MenuData("크림브륄레라떼", 6300)
        ));

        // 빵
        createMenusForCategory(CategoryType.BREAD, Arrays.asList(
            new MenuData("크루아상", 4000),
            new MenuData("식빵", 3000),
            new MenuData("베이글", 3500),
            new MenuData("초코머핀", 4200),
            new MenuData("블루베리머핀", 4200)
        ));

        // 디저트
        createMenusForCategory(CategoryType.DESSERT, Arrays.asList(
            new MenuData("마카롱", 2500),
            new MenuData("쿠키", 2000),
            new MenuData("와플", 5500)
        ));

        // 샌드위치
        createMenusForCategory(CategoryType.SANDWICH, Arrays.asList(
            new MenuData("햄치즈샌드위치", 5500),
            new MenuData("에그샌드위치", 5300),
            new MenuData("클럽샌드위치", 6000)
        ));

        // MD상품
        createMenusForCategory(CategoryType.MD, Arrays.asList(
            new MenuData("텀블러", 15000),
            new MenuData("머그컵", 12000),
            new MenuData("원두 200g", 10000)
        ));

        // 세트메뉴
        createMenusForCategory(CategoryType.SET, Arrays.asList(
            new MenuData("아메리카노+크루아상", 6500),
            new MenuData("카페라떼+쿠키", 7000)
        ));

        // 케이크
        createMenusForCategory(CategoryType.CAKE, Arrays.asList(
            new MenuData("티라미수", 6500),
            new MenuData("초코케이크", 6000),
            new MenuData("치즈케이크", 6000),
            new MenuData("당근케이크", 5800)
        ));

        // 기타
        createMenusForCategory(CategoryType.ETC, Arrays.asList(
            new MenuData("생수", 1500),
            new MenuData("탄산수", 2000)
        ));
    }

    private void createMenusForCategory(CategoryType categoryType, List<MenuData> menuDataList) {
        logger.info("{} 카테고리 메뉴 생성 시작 - {} 개", categoryType.getDisplayName(), menuDataList.size());
        
        // 카테고리 엔티티 찾기
        MenuCategory category = menuCategoryRepository.findByType(categoryType)
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다: " + categoryType));
        
        for (MenuData menuData : menuDataList) {
            try {
                // 중복 메뉴 체크
                if (menuRepository.findByName(menuData.name).isEmpty()) {
                    Menu menu = Menu.builder()
                        .name(menuData.name)
                        .price(menuData.price)
                        .category(categoryType.getDisplayName())
                        .available(true)
                        .build();
                    menuRepository.save(menu);
                    logger.debug("메뉴 생성: {} - {}원", menuData.name, menuData.price);
                } else {
                    logger.debug("이미 존재하는 메뉴: {}", menuData.name);
                }
            } catch (Exception e) {
                logger.error("메뉴 생성 실패: {} - {}", menuData.name, e.getMessage());
            }
        }
        
        logger.info("{} 카테고리 메뉴 생성 완료", categoryType.getDisplayName());
    }

    private static class MenuData {
        String name;
        int price;

        MenuData(String name, int price) {
            this.name = name;
            this.price = price;
        }
    }
} 