package com.example.cafecontrolsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    @GetMapping("/")
    public String main() {
        return "AdminSignUpUI"; // AdminSignUpUI.html 파일을 메인 페이지로 반환
    }
    @GetMapping("/SignIn")
    public String adminSignIn() {
        return "AdminSignInUI"; // AdminSignInUI.html 파일을 반환 (관리자 가입)
    }
    
    @GetMapping("/dashboard")
    public String dashboard() {
        return "index"; // 대시보드 페이지(index.html)
    }
} 