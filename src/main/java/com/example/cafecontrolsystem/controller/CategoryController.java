package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @GetMapping("/types")
    public ResponseEntity<List<String>> getCategoryTypes() {
        return ResponseEntity.ok(Arrays.stream(CategoryType.values())
                .map(CategoryType::name)
                .toList());
    }

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getCategories() {
        List<Map<String, String>> categories = Arrays.stream(CategoryType.values())
                .map(categoryType -> {
                    Map<String, String> category = new HashMap<>();
                    category.put("value", categoryType.name());
                    category.put("label", getCategoryLabel(categoryType));
                    return category;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(categories);
    }
    
    private String getCategoryLabel(CategoryType categoryType) {
        switch (categoryType) {
            case COFFEE:
                return "커피";
            case DECAF:
                return "디카페인";
            case NON_COFFEE:
                return "논커피<br>과일라떼";
            case TEA:
                return "티";
            case SMOOTHIE:
                return "스무디<br>프라페";
            case ADE:
                return "에이드<br>주스";
            case SEASON:
                return "시즌메뉴";
            case BREAD:
                return "빵";
            case DESSERT:
                return "디저트";
            case SANDWICH:
                return "샌드위치";
            case MD:
                return "MD상품";
            case SET:
                return "세트메뉴";
            case CAKE:
                return "케이크";
            case ETC:
                return "기타";
            default:
                return categoryType.name();
        }
    }
} 