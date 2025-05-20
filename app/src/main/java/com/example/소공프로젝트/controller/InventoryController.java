package com.example.소공프로젝트.controller;


import com.example.소공프로젝트.Entity.Inventory;
import com.example.소공프로젝트.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("items", inventoryService.getAll());
        return "inventory/list";
    }

    @GetMapping("/add")
    public String addForm(Model model) {
        model.addAttribute("inventory", new Inventory());
        return "inventory/add";
    }

    @PostMapping("/add")
    public String add(@ModelAttribute Inventory inventory) {
        inventoryService.save(inventory);
        return "redirect:/inventory";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return "redirect:/inventory";
    }
}

