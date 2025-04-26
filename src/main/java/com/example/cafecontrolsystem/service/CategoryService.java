package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.MenuCategory;
import com.example.cafecontrolsystem.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<MenuCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public MenuCategory getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다: " + id));
    }

    public MenuCategory saveCategory(MenuCategory category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
} 