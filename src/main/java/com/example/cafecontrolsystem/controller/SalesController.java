package com.example.cafecontrolsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SalesController {

    @GetMapping("/Sales")
    public String showSalesPage() {
        return "Sales_index";
    }
} 