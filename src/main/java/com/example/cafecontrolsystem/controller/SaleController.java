package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.SaleSummaryDateDto;
import com.example.cafecontrolsystem.dto.SaveSaleDto;
import com.example.cafecontrolsystem.dto.ShowSaleSummaryDto;
import com.example.cafecontrolsystem.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sales")
public class SaleController {
    private final SaleService saleService;

    @PostMapping()
    public ResponseEntity<String> pay(SaveSaleDto saveSaleDto){
        saleService.saveSale(saveSaleDto);

        return ResponseEntity.ok("Success");
    }

    @PostMapping("/summary")
    public ResponseEntity<ShowSaleSummaryDto> summary(SaleSummaryDateDto saleSummaryDateDto){
        return ResponseEntity.ok(saleService.showSale(saleSummaryDateDto));
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<String> IllegalArgument(IllegalArgumentException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
