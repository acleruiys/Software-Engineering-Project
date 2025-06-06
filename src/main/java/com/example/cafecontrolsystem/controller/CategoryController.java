package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;

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
                    category.put("label", categoryType.getDisplayName());
                    category.put("value", categoryType.name());
                    return category;
                })
                .toList();
        return ResponseEntity.ok(categories);
    }
} 