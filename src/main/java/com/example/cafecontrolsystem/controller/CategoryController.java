package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.CategoryType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @GetMapping("/types")
    public ResponseEntity<List<String>> getCategoryTypes() {
        return ResponseEntity.ok(Arrays.stream(CategoryType.values())
                .map(CategoryType::name)
                .toList());
    }

} 