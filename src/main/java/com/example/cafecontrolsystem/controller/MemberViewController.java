package com.example.cafecontrolsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/members")
public class MemberViewController {

    @GetMapping
    public String memberManagementPage() {
        return "/member";
    }
    
    @GetMapping("/search")
    public String memberSearchPage() {
        return "/member/memberSearch";
    }
}