package com.example.cafecontrolsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/Index")
    public String showIndexPage() {
        return "index";
    }
}
