package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.SaveSaleDto;
import com.example.cafecontrolsystem.entity.MenuOption;
import com.example.cafecontrolsystem.entity.Menu_entity;
import com.example.cafecontrolsystem.service.MenuService;
import com.example.cafecontrolsystem.service.OptionService;
import com.example.cafecontrolsystem.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;
    private final MenuService menuService;
    private final OptionService optionService;

    @PostMapping("/sale")
    public void saveSale(@RequestBody SaveSaleDto saveSaleDto){
        saleService.saveSale(saveSaleDto);
    }

    @PostMapping("/menu")
    public void saveMenu(@RequestBody Menu_entity menuEntity){
        menuService.saveMenu(menuEntity);
    }

    @PostMapping("/option")
    public void saveOption(@RequestBody MenuOption menuOption){
        optionService.saveOption(menuOption);
    }


}
