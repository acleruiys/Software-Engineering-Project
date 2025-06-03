package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.repository.MenuRepository;
import com.example.cafecontrolsystem.repository.MenuCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @GetMapping("/db-status")
    public ResponseEntity<Map<String, Object>> getDatabaseStatus() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            long menuCount = menuRepository.count();
            long categoryCount = menuCategoryRepository.count();
            
            status.put("success", true);
            status.put("menuCount", menuCount);
            status.put("categoryCount", categoryCount);
            status.put("message", "데이터베이스 연결 성공");
            
        } catch (Exception e) {
            status.put("success", false);
            status.put("error", e.getMessage());
            status.put("message", "데이터베이스 연결 실패");
        }
        
        return ResponseEntity.ok(status);
    }
} 